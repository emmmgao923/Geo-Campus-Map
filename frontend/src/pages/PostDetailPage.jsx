import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import SidebarDetail from "../components/SidebarDetail";
import axios from "axios"
import { useAuth } from "../context/AuthContext.jsx";


const API_BASE = "http://localhost:8000/api/events"; 
const API_BASE_COMMENT = "http://localhost:8000/api/comments"; 

// ======= Type label/colors =======
const TYPE_LABEL = {
  help: "Help",
  notice: "Notice",
  study: "Study",
  activity: "Activity",
  food: "Food",
  emergency: "Emergency",
  other: "Other",
};
const TYPE_BG = {
  help: "#eef2ff",
  notice: "#fef9c3",
  study: "#dcfce7",
  activity: "#e0f2fe",
  food: "#ffe4e6",
  emergency: "#fee2e2",
  other: "#f3f4f6",
};
const TYPE_FG = {
  help: "#3730a3",
  notice: "#854d0e",
  study: "#065f46",
  activity: "#075985",
  food: "#9f1239",
  emergency: "#991b1b",
  other: "#111827",
};

// ======= Time helpers =======
const absTime = (ts) => new Date(ts || Date.now()).toLocaleString();
const relTime = (ts) => {
  const now = Date.now();
  const t = ts || now;
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d >= 7) return absTime(t);
  if (d >= 1) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h >= 1) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (m >= 1) return `${m} minute${m > 1 ? "s" : ""} ago`;
  return `${s} second${s !== 1 ? "s" : ""} ago`;
};

// ======= Avatar =======
const Avatar = ({ name = "U" }) => {
  const initial = String(name).trim()[0]?.toUpperCase() || "U";
  return (
    <div
      aria-hidden
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        background: "#e2e8f0",
        color: "#334155",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
      }}
    >
      {initial}
    </div>
  );
};

// ======= Inline Post Editor (右侧编辑模式) =======
function PostEditor({ building, defaultType = "other", onCancel, onPublish }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(defaultType);
  const [body, setBody] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const disabled = !title.trim() || !body.trim();

  return (
    <section
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        minHeight: 0,
        padding: "16px 20px",
        gap: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={building?.name || "Building"}
        >
          What’s up today?
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-lite"
            onClick={onCancel}
            title="Cancel"
            style={{ height: 36 }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            title="Publish"
            disabled={disabled}
            onClick={() =>
              onPublish?.({
                title: title.trim(),
                type,
                summary: body.trim(),
              })
            }
            style={{ opacity: disabled ? 0.6 : 1, height: 36 }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          overflow: "auto",
          minHeight: 0,
          display: "grid",
          alignContent: "start",
          gap: 12,
        }}
      >
        {/* Type */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            Pick a vibe
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              height: 40,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "0 12px",
              outline: "none",
              fontSize: 14,
              background: "#fff",
            }}
          >
            {Object.keys(TYPE_LABEL).map((k) => (
              <option key={k} value={k}>
                {TYPE_LABEL[k]}
              </option>
            ))}
          </select>
        </label>

        {/* Title */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            Give it a catchy title ✨
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a short, clear title…"
            style={{
              height: 44,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "0 12px",
              outline: "none",
              fontSize: 15,
            }}
          />
        </label>

        {/* Body */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            Tell us more💭
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the details here…"
            style={{
              minHeight: 180,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "10px 12px",
              outline: "none",
              fontSize: 15,
              lineHeight: 1.6,
              resize: "vertical",
            }}
          />
        </label>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f1f5f9",
          paddingTop: 8,
          fontSize: 12,
          color: "#64748b",
        }}
      >
        Press <b>Esc</b> to go back. Your story will appear in the list after
        posting!
      </div>
    </section>
  );
}

// ======= 主组件：根据 buildingId + eventId 渲染 =======
export default function PostDetailPage() {
  const { buildingId } = useParams();
  const { search } = useLocation();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const eventId = params.get("eventId");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!!eventId);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const listRef = useRef(null);

  // 用 eventId 拉真正的详细 post
  useEffect(() => {
    if (!eventId) {
      setPost(null);
      setLoading(false);
      return;
    }

    let aborted = false;

    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API_BASE}/detail/${eventId}`);
        if (!r.ok) throw new Error("bad status");
        const data = await r.json();
        if (!aborted) {
          setPost(data);
          setLiked(!!data?.liked);
        }
      } catch (err) {
        console.error("Failed to fetch event detail", err);
        if (!aborted) {
          setPost(null); // 显示失败信息
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [eventId]);


  useEffect(() => {
    if (!eventId) {
      setComments([]);
      return;
    }
  
    let aborted = false;
  
    (async () => {
      setCommentsLoading(true);
      try {
        const r = await axios.get(`http://localhost:8000/api/comments/${eventId}`);
  
        if (!aborted) {
          // Axios 返回结果在 r.data 中
          setComments(Array.isArray(r.data) ? r.data : []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch comments:", err.response?.data || err.message);
        if (!aborted) setComments([]);
      } finally {
        if (!aborted) setCommentsLoading(false);
      }
    })();
  
    return () => {
      aborted = true;
    };
  }, [eventId]);
  














  // Sidebar “Start a new post” → 打开编辑器
  useEffect(() => {
    const onOpenEditor = () => setIsEditing(true);
    window.addEventListener("app:open-editor", onOpenEditor);
    return () => window.removeEventListener("app:open-editor", onOpenEditor);
  }, []);

  // ==== 评论 & 点赞逻辑（仍然本地模拟，后面可接 API） ====
  const addComment = async () => {
    const text = draft.trim();
    if (!text || !eventId) return;

    // 乐观本地加一条
    const temp = {
      _id: `temp-${Date.now()}`,
      event_id: Number(eventId),
      user_id: user?.email || "You",                // TODO: 换成真实用户
      username: user?.username || "Guest",
      content: text,
      likes_count: 0,
      timestamp: new Date().toISOString(),
    };

    setComments((prev) => [...prev, temp]);
    setDraft("");

    try {
      await axios.post("http://localhost:8000/api/comments", {
        event_id: String(eventId),
        user_id: user?.email || "Guest",
        content: text,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Failed to send comment:", err.response?.data || err.message);
    }
  };

  const deleteComment = async (id) => {
    const target = comments.find((c) => c._id === id);
    if (!target || target.user_id !== "You") return;
    if (!window.confirm("Delete this comment?")) return;

    setComments((prev) => prev.filter((c) => c._id !== id));

    // await fetch(`${COMMENTS_API_BASE}/${id}`, { method: "DELETE" });
  };

  const deletePost = () => {
    if (!target || target.user_id !== (user?.email || "You")) return;

    if (!window.confirm("Delete this post?")) return;
    setPost((p) =>
      p ? { ...p, title: "[deleted]", summary: "", comments: [] } : p
    );
  };

  const toggleLike = () => {
    if (!post) return;
    setLiked((v) => !v);
    setPost((p) =>
      p
        ? {
            ...p,
            likesCount: (p.likesCount || 0) + (liked ? -1 : 1),
          }
        : p
    );
  };

  const isPostMine = !!post && post.author === "You";
  const typeKey = String(post?.type || "other").toLowerCase();
  const badgeBg = TYPE_BG[typeKey] || TYPE_BG.other;
  const badgeFg = TYPE_FG[typeKey] || TYPE_FG.other;
  const typeLabel = TYPE_LABEL[typeKey] || TYPE_LABEL.other;
  const commentCount = (post?.comments || []).length;

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handlePublish = useCallback(
    ({ title, type, summary }) => {
      // TODO: 换成真实创建 API，然后刷新列表/详情
      const newPost = {
        id: `new-${Date.now()}`,
        building: post?.building || null,
        author: "You",
        type,
        title,
        summary,
        createdAt: Date.now(),
        likesCount: 0,
        comments: [],
      };
      setPost(newPost);
      setIsEditing(false);
    },
    [post?.building]
  );

  // ======= 外层布局（基本不动你原来的风格） =======
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 60px",
        backgroundColor: "#fafafa",
        height: "calc(100vh - 64px)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "white",
          display: "grid",
          gridTemplateColumns: "400px 1fr",
        }}
      >
        {/* 左侧 Sidebar：使用 buildingId + 高亮 eventId */}
        <div
          style={{
            height: "100%",
            minHeight: 0,
            display: "flex",
          }}
        >
          <SidebarDetail
            buildingId={buildingId}
            selectedEventId={eventId}
          />
        </div>

        {/* 右侧：详情 / 编辑器 */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isEditing
              ? "1fr"
              : "minmax(0, 0.42fr) minmax(0, 0.58fr)",
            rowGap: isEditing ? 0 : 4,
            minHeight: 0,
            height: "100%",
            borderLeft: "1px solid #eee",
          }}
        >
          {/* 如果没选 eventId，又没在编辑，就提醒从左边选 */}
          {!isEditing && !eventId && (
            <div
              style={{
                padding: 24,
                fontSize: 14,
                color: "#6b7280",
              }}
            >
              Select a post from the left to view details.
            </div>
          )}

          {isEditing ? (
            <PostEditor
              building={post?.building}
              defaultType={typeKey}
              onCancel={handleCancelEdit}
              onPublish={handlePublish}
            />
          ) : (
            eventId && (
              <>
                {/* TOP: Post detail */}
                <section
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateRows:
                      "auto auto 1fr auto",
                    rowGap: 8,
                    minHeight: 0,
                    padding: "16px 20px",
                    overflow: "hidden",
                  }}
                >
                  {loading ? (
                    <div>Loading…</div>
                  ) : !post ? (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: 14,
                      }}
                    >
                      Failed to load this post.
                    </div>
                  ) : (
                    <>
                      {/* time */}
                      <time
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 20,
                          color: "#64748b",
                          fontSize: 13,
                          whiteSpace: "nowrap",
                        }}
                        title={absTime(post?.createdAt || post?.timestamp)}
                      >
                        {relTime(post?.createdAt || post?.timestamp)}
                      </time>

                      {/* Row 1: avatar + author */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar name={post?.author || "U"} />
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={post?.author || "Unknown"}
                        >
                          {post?.author || "Unknown"}
                        </div>
                      </div>

                      {/* Row 2: badge + title */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            padding: "5px 10px",
                            borderRadius: 999,
                            background: badgeBg,
                            color: badgeFg,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {typeLabel}
                        </span>
                        <h1
                          style={{
                            margin: 0,
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1.25,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                          }}
                          title={post?.title}
                        >
                          {post?.title || "(No title)"}
                        </h1>
                      </div>

                      {/* Row 3: body */}
                      <div
                        style={{
                          minHeight: 0,
                          overflowY: "auto",
                          fontSize: 15,
                          color: "#0f172a",
                          lineHeight: 1.6,
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          marginTop: 8,
                        }}
                      >
                        {post?.summary || post?.content || "(No content)"}
                      </div>

                      {/* Row 4: actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          color: "#334155",
                        }}
                      >
                        <button
                          onClick={toggleLike}
                          title="Like"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 14,
                            color: liked ? "#ef4444" : "#334155",
                          }}
                        >
                          <span>{liked ? "❤️" : "🤍"}</span>
                          <span>{post?.likesCount ?? 0}</span>
                        </button>

                        <div
                          title="Comments"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 14,
                          }}
                        >
                          <span>💬</span>
                          <span>{commentCount}</span>
                        </div>

                        {isPostMine && (
                          <button
                            onClick={deletePost}
                            title="Delete post"
                            style={{
                              marginLeft: "auto",
                              border: "none",
                              background: "transparent",
                              color: "#64748b",
                              textDecoration: "underline",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            delete post
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </section>

              {/* BOTTOM: Comments */}
              <section
                style={{
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                  minHeight: 0,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "6px 20px 8px 20px",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#0f172a",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  Comments
                </div>

                {/* List */}
                <div
                  ref={listRef}
                  style={{
                    padding: "12px 20px",
                    overflowY: "auto",
                    minHeight: 0,
                  }}
                >
                  {commentsLoading && <div>Loading…</div>}

                  {!commentsLoading &&
                    comments.map((c) => {
                      const isMine = c.user_id === "You"; // TODO: 换成真实登录用户判断
                      return (
                        <div
                          key={c._id}
                          style={{
                            position: "relative",
                            display: "grid",
                            gridTemplateColumns: "40px 1fr",
                            gridTemplateRows: "20px auto",
                            columnGap: 10,
                            rowGap: 6,
                            padding: 12,
                            border: "1px solid #eef2f7",
                            borderRadius: 12,
                            marginBottom: 10,
                            background: "#fff",
                          }}
                        >
                          {/* Avatar */}
                          <div
                            style={{
                              gridRow: "1 / span 2",
                              alignSelf: "start",
                            }}
                          >
                            <Avatar name={c.user_id} />
                          </div>

                          {/* Header: user + time */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0f172a",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                paddingRight: 8,
                              }}
                              title={c.user_id}
                            >
                              {c.user_id}
                            </div>
                            <time
                              style={{
                                color: "#64748b",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                              title={absTime(c.timestamp)}
                            >
                              {relTime(new Date(c.timestamp).getTime())}
                            </time>
                          </div>

                          {/* Content */}
                          <div
                            style={{
                              color: "#0f172a",
                              fontSize: 14,
                              lineHeight: 1.6,
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              paddingRight: isMine ? 56 : 0,
                            }}
                          >
                            {c.content}
                          </div>

                          {/* Delete (only mine, 本地示例逻辑) */}
                          {isMine && (
                            <button
                              onClick={() => deleteComment(c._id)}
                              title="Delete"
                              style={{
                                position: "absolute",
                                right: 12,
                                bottom: 8,
                                border: "none",
                                background: "transparent",
                                color: "#64748b",
                                textDecoration: "underline",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              delete
                            </button>
                          )}
                        </div>
                      );
                    })}

                  {!commentsLoading && comments.length === 0 && (
                    <div className="muted" style={{ padding: 12 }}>
                      No comments yet.
                    </div>
                  )}
                </div>

                {/* Composer：保持不变，只是 addComment 要写到用 eventId 发请求 */}
                {eventId && (
                  <div
                    style={{
                      borderTop: "1px solid #f1f5f9",
                      padding: "10px 20px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 8,
                      alignItems: "center",
                      background: "#fff",
                    }}
                  >
                    <input
                      placeholder={user ? "Write a comment…" : "Sign in to comment"}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      disabled={!user} // ✅ 未登录禁用
                      onCompositionStart={() => (window.__imeComposing = true)}
                      onCompositionEnd={() => (window.__imeComposing = false)}
                      onKeyDown={(e) => {
                        const composing = window.__imeComposing;
                        if (!composing && e.key === "Enter") {
                          e.preventDefault();
                          addComment();
                        }
                      }}
                      style={{
                        height: 40,
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "0 12px",
                        outline: "none",
                        fontSize: 14,
                      }}
                    />
                    <button
                      className="btn-primary"
                      onClick={addComment}
                      disabled={!user}
                      title={user ? "Send" : "Sign in to comment"}
                    >
                      Send
                    </button>
                  </div>
                )}
              </section>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
