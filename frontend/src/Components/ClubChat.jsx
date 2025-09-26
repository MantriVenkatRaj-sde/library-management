// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
 import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getClubMessagesSinceApi, postMessageViaRest } from "../API/MessagesAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import "../Styling/Background.css";
import "../Styling/Chat.css";

export function Chat() {
  const { userName, clubName, connected, setConnected, setClubName, setUserName } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const { clubid,clubname } = useParams();

  // initialize clubName and userName from route/auth if missing
  useEffect(() => {
    if (clubid && clubname && !clubName) {
      setClubName(decodeURIComponent(clubname));
    }
    if (!userName && auth && auth.user) {
      setUserName(auth.user);
    }
    console.log("Chat mounted with club param:", clubname, "clubName in context:", clubName, "userName:", userName,"clubId:",clubid);
  }, [clubname,clubid, clubName, setClubName, userName, setUserName, auth]);

  // scroll to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // load initial messages when clubName changes
  useEffect(() => {
    if (!clubName) {
      setMessages([]);
      return;
    }
    let isMounted = true;
    async function loadMessages() {
      try {
        const resp = await getClubMessagesSinceApi(clubName); // function should return res.data or similar
        console.log("[CHAT] raw messages response:", resp);

        // Be defensive: accept either an array or an axios-like { data: array } or full response
        const arr = Array.isArray(resp)
          ? resp
          : (resp && Array.isArray(resp.data) ? resp.data : []);

        const normalized = arr.map((m) => ({
          id: m.id,
          sendername:
            (m.sender && (m.sender.username || m.sender.name)) ||
            m.sendername ||
            m.sender ||
            "Unknown",
          content: m.content,
          sentAt: m.sentAt || m.sent_at || Date.now(),
        }));

        if (!isMounted) return;
        setMessages(normalized);
      } catch (err) {
        console.error("Failed to load messages", err);
        toast.error("Could not load messages");
      }
    }
    loadMessages();
    return () => { isMounted = false; };
  }, [clubName]);

  // connect STOMP and subscribe
  useEffect(() => {
    // ensure there's at least a default club
    if (!clubName) return;
    // Use auth.token exactly as you provided ("Bearer <raw>") — no reformatting
    const connectHeaders = auth && auth.token ? { Authorization: auth.token } : {};
    console.log("[STOMP] will connect with headers:", connectHeaders);

    const client = new Client({
      webSocketFactory: () => {
        console.log("[STOMP] creating SockJS -> http://localhost:8080/chat");
        return new SockJS("http://localhost:8080/chat");
      },
      connectHeaders,
      reconnectDelay: 5000,
      debug: (msg) => console.debug("[STOMP DEBUG]", msg),
      beforeConnect: () => console.log("[STOMP] beforeConnect"),
      onConnect: (frame) => {
        console.log("[STOMP] onConnect frame:", frame);
        setConnected && setConnected(true);
        

        // subscribe to the server's broadcast topic
        try {
          const topic = `/topic/bookclub.${clubName}`; // must match server exactly
          console.log("[STOMP] subscribing to topic:", topic);

          // unsubscribe old
          if (subscriptionRef.current) {
            try { subscriptionRef.current.unsubscribe(); } catch (_) {}
            subscriptionRef.current = null;
          }

          subscriptionRef.current = client.subscribe(topic, (frame) => {
            console.log("[STOMP] message frame:", frame);
            try {
              const body = JSON.parse(frame.body);
              const normalized = {
                id: body.id,
                sendername: body.sendername || body.sender || (body.sender && body.sender.username) || "Unknown",
                content: body.content,
                sentAt: body.sentAt || body.sent_at || Date.now(),
              };
              setMessages((prev) => [...prev, normalized]);
            } catch (e) {
              console.error("[STOMP] failed parsing message", e, frame.body);
            }
          });
        } catch (err) {
          console.error("[STOMP] subscribe error", err);
        }
      },
      onStompError: (frame) => {
        console.error("[STOMP] broker error:", frame);
        toast.error("WebSocket broker error");
      },
      onWebSocketOpen: (evt) => console.log("[STOMP] websocket open", evt),
      onWebSocketError: (evt) => console.error("[STOMP] websocket error", evt),
      onWebSocketClose: (evt) => { console.warn("[STOMP] websocket close", evt); setConnected && setConnected(false); },
      onDisconnect: () => { setConnected && setConnected(false); }
    });

    client.activate();
    stompRef.current = client;

    return () => {
      try {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        if (stompRef.current) {
          stompRef.current.deactivate();
          stompRef.current = null;
        }
      } catch (err) {
        console.warn("Error while disconnecting STOMP", err);
      } finally {
        setConnected && setConnected(false);
      }
    };
  }, [clubName, setConnected, auth]); // include auth so connection picks up token changes

  // send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const client = stompRef.current;

    const payload = {
      clubname: clubName,
      content: input.trim(),
    };

    try {
      if (client && client.connected) {
        client.publish({
          destination: "/app/chat.send", // publish to /app -> server @MessageMapping("/chat.send")
          body: JSON.stringify(payload),
        });
      } else {
        // fallback using REST
        await postMessageViaRest({ clubname: clubName, sendername: userName, content: input.trim() });
      }
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
      toast.error("Failed to send message");
    }
  };

  function handleBack() {
    try {
      if (stompRef.current) stompRef.current.deactivate();
    } catch (e) {
      console.warn(e);
    } finally {
      setConnected && setConnected(false);
      setClubName("");
      navigate("/home");
    }
  }

  return (
    <div className="d-flex flex-column bg-dark vh-100 w-100 text-light mt-5">
      <header
        className="d-flex align-items-center p-3 bg-dark text-light chat-header"
        style={{
          position: "sticky",
          top: "50px",
          zIndex: 1000,
          width: "100%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left: Back button */}
        <div className="d-flex align-items-center" style={{ position: "absolute", left: "15px" }}>
          <button
            className="btn btn-secondary me-2"
            type="button"
            onClick={handleBack}
            style={{ backgroundColor: "Red", transition: "transform 0.2s" }}
            title="Back"
            onMouseEnter={(e) => (
              (e.currentTarget.style.transform = "scale(1.2)"),
              (e.currentTarget.style.boxShadow = "0 0 10px #198754")
            )}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <AiOutlineArrowLeft size={20} />
          </button>
        </div>

        {/* Center: Club name */}
        <div
          className="text-light text-center w-100 fw-bold fs-3"
          onClick={()=> navigate(`/clubs/bookclub/${clubid}/${clubName}`)}
        >
            <div 
            style={{ cursor: "pointer" }}
            title={clubName} >
              {clubName}
            </div>
        </div>
      </header>

      <div
        className="container bg-dark rounded overflow-auto p-10 fixed component"
        style={{ minHeight: "70vh", maxHeight: "80vh", marginBottom: "60px",width:"100%"}}
        aria-live="polite"
        ref={chatBoxRef}
      >
        {messages.map((msg, index) => {
          const isYou = (msg.sendername || "").toLowerCase() === (userName || "").toLowerCase();
          return (
            <div
              key={msg.id ?? index}
              className={isYou ? "d-flex justify-content-end mb-2" : "d-flex justify-content-start mb-2"}
            >
              <div className={`d-inline-block rounded px-3 py-2 ${isYou ? "bg-primary text-light" : "bg-success text-light"}`}>
                <div className={isYou ? "text-end small text-muted text-light" : "text-start small text-muted text-light"}>
                  {isYou ? "You" : msg.sendername}{" "}
                  <span className="small text-muted">· {new Date(msg.sentAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="d-flex justify-content-center align-items-center fixed-bottom p-3 bg-dark "
      >
        
        <div style={{ flex: 1 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="form-control w-100 rounded bg-secondary text-light"
            placeholder="Type your message..."
            aria-label="message"
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary ms-2" disabled={!input.trim()}>
          <MdSend size={20} />
        </button>
      </form>
    </div>
  );
}
