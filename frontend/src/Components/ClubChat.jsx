// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getClubAllMessagesApi, getClubMessagesSinceApi, postMessageViaRest } from "../API/MessagesAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import "../Styling/Background.css";
import "../Styling/Chat.css";

/* ---------- per-user color helpers ---------- */
const PALETTE = [
  "#103965ff", "#512e0cff", "#571415ff", "#155953ff", "#15480eff",
  "#42370fff", "#58214bff", "#56262bff", "#5d3621ff", "#542913ff"
];
function colorFromName(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function Chat() {
  const { userName, clubName, setConnected, setClubName, setUserName } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userColors, setUserColors] = useState(new Map()); // will load per club below

  const chatBoxRef = useRef(null);
  const stompRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const { clubid, clubname } = useParams();

  /* ---------- init club/user from route/auth ---------- */
  useEffect(() => {
    if (clubid && clubname) setClubName(decodeURIComponent(clubname));
    if (!userName && auth?.user) setUserName(auth.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubid, clubname, auth?.user]);

  /* ---------- load user color map for this club from sessionStorage ---------- */
  useEffect(() => {
    const key = `chatColors:${clubName || "global"}`;
    const saved = sessionStorage.getItem(key);
    setUserColors(saved ? new Map(JSON.parse(saved)) : new Map());
  }, [clubName]);

  /* ---------- persist color map when it changes ---------- */
  useEffect(() => {
    const key = `chatColors:${clubName || "global"}`;
    sessionStorage.setItem(key, JSON.stringify(Array.from(userColors.entries())));
  }, [userColors, clubName]);

  function colorFor(sender) {
    if (!sender) return "#666";
    if (!userColors.has(sender)) {
      const next = new Map(userColors);
      next.set(sender, colorFromName(sender));
      setUserColors(next);
      return next.get(sender);
    }
    return userColors.get(sender);
  }

  /* ---------- autoscroll on new messages ---------- */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  /* ---------- initial messages load per club ---------- */
  useEffect(() => {
    if (!clubName) { setMessages([]); return; }
    let isMounted = true;
    (async () => {
      try {
        const resp = await getClubAllMessagesApi(clubName,userName);
        const arr = Array.isArray(resp) ? resp : (resp?.data && Array.isArray(resp.data) ? resp.data : []);
        const normalized = arr.map((m) => ({
          id: m.id,
          sendername: (m.sender && (m.sender.username || m.sender.name)) || m.sendername || m.sender || "Unknown",
          content: m.content,
          sentAt: m.sentAt || m.sent_at || Date.now(),
        }));
        if (isMounted) setMessages(normalized);
      } catch (err) {
        console.error("Failed to load messages", err);
        toast.error("Could not load messages");
      }
    })();
    return () => { isMounted = false; };
  }, [clubName]);

  /* ---------- STOMP connect/subscribe ---------- */
  useEffect(() => {
    if (!clubName) return;

    const connectHeaders = auth?.token ? { Authorization: auth.token } : {};
    const client = new Client({
      webSocketFactory: () => new SockJS("http://bookcircle-sprinboot-server-alb-1527815027.ap-south-1.elb.amazonaws.com:8080/chat"),
      connectHeaders,
      reconnectDelay: 5000,
      debug: (msg) => console.debug("[STOMP DEBUG]", msg),
      onConnect: () => {
        setConnected?.(true);
        try {
          const topic = `/topic/bookclub.${clubName}`;
          if (subscriptionRef.current) {
            try { subscriptionRef.current.unsubscribe(); } catch {}
            subscriptionRef.current = null;
          }
          subscriptionRef.current = client.subscribe(topic, (frame) => {
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
              console.error("[STOMP] parse error", e);
            }
          });
        } catch (err) {
          console.error("[STOMP] subscribe error", err);
        }
      },
      onWebSocketError: (e) => console.error("[STOMP] websocket error", e),
      onWebSocketClose: () => setConnected?.(false),
      onStompError: (frame) => { console.error("[STOMP] broker error:", frame); toast.error("WebSocket broker error"); },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      try {
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = null;
        stompRef.current?.deactivate();
        stompRef.current = null;
      } catch (e) {
        console.warn("Disconnect error", e);
      } finally {
        setConnected?.(false);
      }
    };
  }, [clubName, setConnected, auth]);

  /* ---------- send message ---------- */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const client = stompRef.current;
    const payload = { clubname: clubName, content: input.trim() };

    try {
      if (client && client.connected) {
        client.publish({ destination: "/app/chat.send", body: JSON.stringify(payload) });
      } else {
        await postMessageViaRest({ clubname: clubName, sendername: userName, content: input.trim() });
      }
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
      toast.error("Failed to send message");
    }
  };

  function handleBack() {
    try { stompRef.current?.deactivate(); } catch {}
    setConnected?.(false);
    setClubName("");
    navigate(-1);
  }



  return (
    <div className="d-flex flex-column vh-100 w-100 text-light">
      <header
        className="d-flex align-items-center p-3 bg-dark text-light"
        style={{ height: 50, flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <div className="d-flex align-items-center" style={{ position: "absolute", left: 15 }}>
          <button
            className="btn btn-secondary me-2"
            type="button"
            onClick={handleBack}
            style={{ backgroundColor: "Red", transition: "transform 0.2s", borderRadius:"50%"}}
            title="Back"
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <AiOutlineArrowLeft size={20} />
          </button>
        </div>
        <div
          className="text-light text-center w-100 fw-bold fs-3"
          onClick={() => navigate(`/clubs/bookclub/${clubid}/${clubName}`)}
          style={{ cursor: "pointer" }}
          title={clubName}
        >
          {clubName}
        </div>
      </header>

      <div
        ref={chatBoxRef}
        className=" overflow-auto px-2 py-2 component"
        style={{ flex: 1, width: "100%",overflow:"hidden", minHeight: 0 }}
        overflow="hidden"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div>No Messages</div>
        ) : (
          messages.map((msg, index) => {
            const isYou =
              (msg.sendername || "").toLowerCase() === (userName || "").toLowerCase();
            const bg = isYou ? "#062d67ff" : colorFor(msg.sendername);

            return (
              <div
                key={msg.id ?? index}
                className={isYou ? "d-flex justify-content-end mb-2" : "d-flex justify-content-start mb-2"}
              >
                <div
                  className="d-inline-block rounded px-3 py-2 text-light fs-6"
                  style={{ backgroundColor: bg, maxWidth: "70%" }}
                >
                  <div className={isYou ? "text-end fw-bold text-light" : "text-start fw-bold text-light"}>
                    {isYou ? "You" : msg.sendername}{" "}
                    <span className="small text-light">
                      · {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="d-flex justify-content-center align-items-center p-3 bg-dark"
        style={{ flexShrink: 0 }}
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
