import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Image,
  Offcanvas,
  Carousel,
  Breadcrumb,
} from "react-bootstrap";
import "./Chat.css";
import { VscSend } from "react-icons/vsc";
import ChatSidebar from "../src/components/layouts/ChatSideBar";
import { RiAttachmentLine } from "react-icons/ri";
import AttachDropdown from "../src/components/Dropdowns/AttachDropdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../src/Socket";
import {
  debounce,
  getOrSaveFromStorage,
  groupItems,
} from "../Helpers/PreventScroll";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  OPEN_RATING_MODAL,
  REFETCH_CHATS,
  START_TYPING,
  STOP_TYPING,
} from "../src/constants/events";
import {
  clearMessageState,
  fetchMessages,
  sendItems,
} from "../stores/Message/MessageSlice";
import useSocketEvents from "../Hooks/useSocketEventHook";
import {
  fetchChatDetails,
  fetchMyChats,
  removeNewMessagesAlert,
  setNewMessagesAlert,
} from "../stores/Chat/ChatroomSlice";
import { useInfiniteScrollTop } from "6pp";
import MessageComponent from "../src/components/Cards/MessageComponent";
import { NODE_APP_URL } from "../config/app_config";
import ImageModal from "../src/components/Modals/ImageModal";
import {
  GetItemBySpecificUserApi,
  GetItemByUserApi,
} from "../stores/User/UserSlice";
import { useToastContext } from "../Hooks/ToastContextHook";
import useEffectAfterMount from "../Hooks/useEffectAfterMount";
import RatingModal from "../src/components/Modals/RatingModal";
import TypeLoader from "../src/components/Loaders/TypeLoader";
import SendItemOffcanvas from "../src/components/Offcanvases/SendItemOffcanvas";
import MessageComponentSkeleton from "../src/components/Skeletons/Cards/MessageComponentSkeleton";
import { Skeleton } from "@mui/material";

const Chat = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  let chatId = queryParams.get("chatId");

  const { singleData } = useSelector((state) => state.UserStore);
  const { toastType, showToast } = useToastContext();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const handleClose = () => setShow(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const { chats, singleChat, newMessagesAlert, loading } = useSelector(
    (state) => state.ChatroomStore
  );

  const {
    messages: userMessages,
    totalPages,
    status,
    message: Message,
  } = useSelector((state) => state.MessageStore);

  const { data } = useSelector((state) => state.AuthUserStore);

  useEffect(() => {
    dispatch(GetItemBySpecificUserApi({ id: data?.id }));
  }, [dispatch, data?.id]);

  useEffect(() => {
    dispatch(fetchMyChats());
    if (chatId && chatId !== undefined) {
      dispatch(fetchMessages({ chatId, page: 1 }));
      setPage(1);
      dispatch(fetchChatDetails({ chatId }));
    }
  }, [dispatch, chatId]);

  useEffectAfterMount(() => {
    if (status === true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: Message,
      };
      showToast("top-right");
      dispatch(clearMessageState());
    } else if (status === false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: Message,
      };
      showToast("top-right");
      dispatch(clearMessageState());
    }
  }, [status]);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    totalPages,
    page,
    setPage,
    userMessages
  );

  useEffect(() => {
    if (chatId && totalPages && page <= totalPages) {
      dispatch(fetchMessages({ chatId, page }));
    }
  }, [page, totalPages, chatId]);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0 && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (chatId && containerRef.current) {
      const container = containerRef.current;
      container.addEventListener("scroll", handleScroll);

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [page, totalPages, chatId]);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    let members = singleChat?.members_id ? [...singleChat?.members_id] : [];
    setMembers(members);
  }, [singleChat?.members_id]);

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const messageKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter should insert a new line
        e.preventDefault(); // Prevent default Enter behavior
        setMessage((prevMessage) => prevMessage + "\n");
      } else {
        // Enter (without shift) should submit the form
        e.preventDefault();
        submitHandler(e);
      }
    }
  };

  useEffect(() => {
    if (chatId && data?.id) {
      socket.emit(CHAT_JOINED, { userId: data?.id, members });
      dispatch(removeNewMessagesAlert(chatId));
    }

    return () => {
      if (chatId && data?.id) {
        setMessages([]);
        setMessage("");
        setOldMessages([]);
        setPage(1);
        socket.emit(CHAT_LEAVED, { userId: data.id, members });
      }
    };
  }, [chatId, data?.id]);

  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    setAllMessages([...oldMessages, ...messages]);
  }, [oldMessages, messages]);

  useEffect(() => {
    if (chatId && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [allMessages]);

  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
  }, [newMessagesAlert]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      console.log("alert data", data);
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const newMessageAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    [chatId]
  );

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  const openRatingModalListener = useCallback(async (data) => {
    setMessages([]);
    setOldMessages([]);
    setAllMessages([]);
    await dispatch(fetchMessages({ chatId, page: 1 }));
    setPage(1);
    if (data?.openRatingModal && data?.openRatingModal === true) {
      handleRatingModalOpen();
    }
  }, []);

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
    [ONLINE_USERS]: onlineUsersListener,
    [OPEN_RATING_MODAL]: openRatingModalListener,
  };

  useSocketEvents(socket, eventHandlers);

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (chatId) {
      let chat = chats.filter((data, index) => chatId === data._id);
      const isOnline = chat?.members_id?.some((member) =>
        onlineUsers.includes(member)
      );
      setSelectedChat({ chat: chat[0], isOnline });
    }
  }, [chatId, chats, onlineUsers]);

  const [previewData, setPreviewData] = useState(null);
  const [open, setOpen] = useState(false);

  const handlePreviewOpen = () => {
    setOpen(true);
  };
  const handlePreviewClose = () => {
    setOpen(false);
  };

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => {
    setShowOffcanvas(true);
    handleClose();
  };

  const [proposalIds, setProposalIds] = useState([]);

  const handleClick = (id) => {
    try {
      const data = {
        chatId: chatId,
        item_id: [...proposalIds, id],
      };

      dispatch(sendItems(data));
      handleCanvasClose();
    } catch (error) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: error.message,
      };
      showToast("top-left");
    }
  };

  const ProposeItemButton = () => {
    return <></>;
  };

  const [itemsPerGroup, setItemsPerGroup] = useState(3);
  const [groupedItems, setGroupedItems] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newItemsPerGroup = 3;

      if (screenWidth <= 576) {
        newItemsPerGroup = 3;
      } else if (screenWidth <= 776) {
        newItemsPerGroup = 2;
      } else {
        newItemsPerGroup = 3;
      }

      setItemsPerGroup(newItemsPerGroup);
    };

    // Debounce the resize event handler
    const debounceResize = debounce(handleResize, 100);

    window.addEventListener("resize", debounceResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  useEffect(() => {
    if (singleData?.items) {
      setIndex(0);
      setGroupedItems((prev) => {
        let _SpIndex = groupItems(singleData?.items, itemsPerGroup);
        return _SpIndex;
      });
    }
  }, [itemsPerGroup, singleData?.items]);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, module) => {
    setIndex((prev) => {
      return selectedIndex;
    });
  };

  // Handle previous and next actions
  const handlePrev = (e, module) => {
    setIndex((prev) => {
      return index === 0 ? groupedItems.length - 1 : index - 1;
    });
  };

  const handleNext = (e, module) => {
    setIndex((prev) => {
      return index === groupedItems.length - 1 ? 0 : index + 1;
    });
  };

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const handleRatingModalClose = () => {
    setRatingModalVisible(false);
  };
  const handleRatingModalOpen = () => {
    setRatingModalVisible(true);
  };

  return (
    <Container fluid className="chat-container">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate("/")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Chats</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {/* Sidebar */}

        <ChatSidebar
          chats={chats}
          loading={loading}
          chatId={chatId}
          newMessagesAlert={newMessagesAlert}
          onlineUsers={onlineUsers}
        />

        {/* Main Chat Area */}
        <Col md={10} className="chat-area">
          {/* Message Header */}
          {chatId ? (
            <>
              {loading ? (
                <div className="chat-header d-flex align-items-center">
                  <Skeleton variant="circular" width={50} height={50} />
                  <Skeleton
                    width={150}
                    height={30}
                    style={{ marginLeft: "1rem" }}
                  />
                </div>
              ) : (
                <div
                  className="chat-header"
                  onClick={() =>
                    navigate(
                      `/user/profile/${selectedChat?.chat?.members_id[0]}`
                    )
                  }
                >
                  <Image
                    src={
                      selectedChat?.chat?.profile &&
                      selectedChat?.chat?.profile.startsWith("http")
                        ? selectedChat?.chat?.profile
                        : `${NODE_APP_URL}/uploads/users/${selectedChat?.chat?.profile}`
                    }
                    // src="https://via.placeholder.com/600x400/a3a3a3/E6BE8A?text="
                    roundedCircle
                    className="header-avatar"
                  />
                  <div className="header-info">
                    <strong>{selectedChat?.chat?.name}</strong>
                    {/* <div className="header-details">
                  John Doberman John Doberman John Doberman
                </div> */}
                    {/* <div className="message-date">On: 12 Mar 2021</div> */}
                  </div>
                </div>
              )}

              {loading ? (
                <MessageComponentSkeleton />
              ) : (
                <>
                  {allMessages && allMessages?.length !== 0 ? (
                    <>
                      <div className="messages" ref={containerRef}>
                        {allMessages.map((i) => (
                          <MessageComponent
                            key={i._id}
                            message={i}
                            user={data}
                            chatId={chatId}
                            setProposalIds={setProposalIds}
                            handleOffcanvasShow={handleOffcanvasShow}
                            handleClose={handlePreviewClose}
                            handlePreviewOpen={handlePreviewOpen}
                            setPreviewData={setPreviewData}
                          />
                        ))}
                        <div ref={bottomRef} />
                        {userTyping && <TypeLoader />}
                      </div>
                    </>
                  ) : (
                    <Container
                      fluid
                      className="no-chat-selected d-flex justify-content-center align-items-center align-content-center h-100"
                    >
                      <h2>No messages found</h2>
                    </Container>
                  )}
                </>
              )}

              <Form className="message-input" onSubmit={submitHandler}>
                <AttachDropdown
                  handleOffcanvasShow={handleOffcanvasShow}
                  show={show}
                  chatId={chatId}
                  handleClose={handleClose}
                  handleToggle={handleToggle}
                />
                <Form.Control
                  type="text"
                  as="textarea"
                  className="chat-textarea"
                  autoFocus
                  rows={4}
                  placeholder="Type your message..."
                  value={message}
                  onChange={messageOnChange}
                  onKeyDown={messageKeyDown} // Handle key presses
                />
                <Button type="submit" variant="primary" className="send-button">
                  <VscSend style={{ fontSize: "1.4rem", color: "white" }} />
                </Button>
              </Form>
            </>
          ) : (
            <Container className="d-flex justify-content-center align-items-center align-content-center h-100">
              <h4>Select a chat to start messaging</h4>
            </Container>
          )}
        </Col>
      </Row>
      <ImageModal
        data={previewData}
        handleClose={handlePreviewClose}
        open={open}
      />
      <RatingModal
        userData={selectedChat?.chat}
        visible={ratingModalVisible}
        setVisible={setRatingModalVisible}
        closeModal={handleRatingModalClose}
      />
      <SendItemOffcanvas
        showOffcanvas={showOffcanvas}
        handleCanvasClose={handleCanvasClose}
        index={index}
        groupedItems={groupedItems}
        handleNext={handleNext}
        handlePrev={handlePrev}
        handleClick={handleClick}
        handleSelect={handleSelect}
        ProposeItemButton={ProposeItemButton}
      />
    </Container>
  );
};

export default Chat;
