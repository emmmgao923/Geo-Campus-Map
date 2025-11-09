// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import SidebarDetail from "../components/SidebarDetail";

// /**
//  * Constants for type label/colors.
//  */
// const TYPE_LABEL = {
//   help: "Help",
//   notice: "Notice",
//   study: "Study",
//   activity: "Activity",
//   food: "Food",
//   emergency: "Emergency",
//   other: "Other",
// };
// const TYPE_BG = {
//   help: "#eef2ff",
//   notice: "#fef9c3",
//   study: "#dcfce7",
//   activity: "#e0f2fe",
//   food: "#ffe4e6",
//   emergency: "#fee2e2",
//   other: "#f3f4f6",
// };
// const TYPE_FG = {
//   help: "#3730a3",
//   notice: "#854d0e",
//   study: "#065f46",
//   activity: "#075985",
//   food: "#9f1239",
//   emergency: "#991b1b",
//   other: "#111827",
// };

// // ----- time helpers (relative within 7 days, otherwise absolute) -----
// const absTime = (ts) => new Date(ts || Date.now()).toLocaleString();
// const relTime = (ts) => {
//   const now = Date.now();
//   const t = ts || now;
//   const diff = Math.max(0, now - t);
//   const s = Math.floor(diff / 1000);
//   const m = Math.floor(s / 60);
//   const h = Math.floor(m / 60);
//   const d = Math.floor(h / 24);
//   if (d >= 7) return absTime(t);
//   if (d >= 1) return `${d} day${d > 1 ? "s" : ""} ago`;
//   if (h >= 1) return `${h} hour${h > 1 ? "s" : ""} ago`;
//   if (m >= 1) return `${m} minute${m > 1 ? "s" : ""} ago`;
//   return `${s} second${s !== 1 ? "s" : ""} ago`;
// };

// // ----- Small local Avatar -----
// const Avatar = ({ name = "U" }) => {
//   const initial = String(name).trim()[0]?.toUpperCase() || "U";
//   return (
//     <div
//       aria-hidden
//       style={{
//         width: 40,
//         height: 40,
//         borderRadius: 999,
//         background: "#e2e8f0",
//         color: "#334155",
//         display: "grid",
//         placeItems: "center",
//         fontWeight: 700,
//       }}
//     >
//       {initial}
//     </div>
//   );
// };

// /**
//  * Inline Post Editor that replaces the right-panel content.
//  * It keeps the same wrapper and padding so the outer frame never changes size.
//  */
// // function PostEditor({
// //   building,
// //   defaultType = "other",
// //   onCancel,
// //   onPublish,
// // }) {
// //   const [title, setTitle] = useState("");
// //   const [type, setType] = useState(defaultType);
// //   const [body, setBody] = useState("");

// //   // Esc to cancel
// //   useEffect(() => {
// //     const onKey = (e) => {
// //       if (e.key === "Escape") onCancel?.();
// //     };
// //     window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //   }, [onCancel]);

// //   const disabled = !title.trim() || !body.trim();

// //   return (
// //     // Keep the same right column container; just one big section inside.
// //     <section
// //       style={{
// //         display: "grid",
// //         gridTemplateRows: "auto 1fr auto",
// //         minHeight: 0,
// //         padding: "16px 20px 16px 20px",
// //         gap: 12,
// //       }}
// //     >
// //       {/* Header */}
// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "1fr auto",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: 20,
// //             fontWeight: 800,
// //             color: "#0f172a",
// //             overflow: "hidden",
// //             textOverflow: "ellipsis",
// //             whiteSpace: "nowrap",
// //           }}
// //           title={building?.name || "Building"}
// //         >
// //           What’s up today?
// //         </div>
// //         <div style={{ display: "flex", gap: 8 }}>
// //           <button
// //             className="btn-lite"
// //             onClick={onCancel}
// //             title="Cancel"
// //             style={{ height: 36 }}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             className="btn-primary"
// //             title="Publish"
// //             disabled={disabled}
// //             onClick={() =>
// //               onPublish?.({
// //                 title: title.trim(),
// //                 type,
// //                 summary: body.trim(),
// //               })
// //             }
// //             style={{ opacity: disabled ? 0.6 : 1, height: 36 }}
// //           >
// //             Post
// //           </button>
// //         </div>
// //       </div>

// //       {/* Form */}
// //       <div
// //         style={{
// //           overflow: "auto",
// //           minHeight: 0,
// //           display: "grid",
// //           alignContent: "start",
// //           gap: 12,
// //         }}
// //       >
// //         {/* Type */}
// //         <label style={{ display: "grid", gap: 6 }}>
// //           <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
// //             Pick a vibe
// //           </span>
// //           <select
// //             value={type}
// //             onChange={(e) => setType(e.target.value)}
// //             style={{
// //               height: 40,
// //               border: "1px solid #e5e7eb",
// //               borderRadius: 10,
// //               padding: "0 12px",
// //               outline: "none",
// //               fontSize: 14,
// //               background: "#fff",
// //             }}
// //           >
// //             {Object.keys(TYPE_LABEL).map((k) => (
// //               <option key={k} value={k}>
// //                 {TYPE_LABEL[k]}
// //               </option>
// //             ))}
// //           </select>
// //         </label>

// //         {/* Title */}
// //         <label style={{ display: "grid", gap: 6 }}>
// //           <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
// //           Give it a catchy title ✨
// //           </span>
// //           <input
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             placeholder="Add a short, clear title…"
// //             style={{
// //               height: 44,
// //               border: "1px solid #e5e7eb",
// //               borderRadius: 10,
// //               padding: "0 12px",
// //               outline: "none",
// //               fontSize: 15,
// //             }}
// //           />
// //         </label>

// //         {/* Body */}
// //         <label style={{ display: "grid", gap: 6 }}>
// //           <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
// //             Tell us more💭
// //           </span>
// //           <textarea
// //             value={body}
// //             onChange={(e) => setBody(e.target.value)}
// //             placeholder="Write the details here…"
// //             style={{
// //               minHeight: 180,
// //               border: "1px solid #e5e7eb",
// //               borderRadius: 12,
// //               padding: "10px 12px",
// //               outline: "none",
// //               fontSize: 15,
// //               lineHeight: 1.6,
// //               resize: "vertical",
// //             }}
// //           />
// //         </label>
// //       </div>

// //       {/* Footer meta (subtle helper text to keep spacing) */}
// //       <div
// //         style={{
// //           borderTop: "1px solid #f1f5f9",
// //           paddingTop: 8,
// //           fontSize: 12,
// //           color: "#64748b",
// //         }}
// //       >
// //         Press <b>Esc</b> to go back. Your story will appear in the list after posting!
// //       </div>
// //     </section>
// //   );
// // }




// export default function PostDetailPage() {
//   const { buildingId, eventId } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [draft, setDraft] = useState(""); // comment composer
//   const [liked, setLiked] = useState(false);

//   // New: editor mode flag
//   const [isEditing, setIsEditing] = useState(false);

//   const listRef = useRef(null);

//   useEffect(() => {
//     // ✅ 异步自调用函数
//     (async () => {
//       try {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/events/${buildingId}`
//         );
//         const allEvents = res.data;
//         setEventList(allEvents); // ✅ 保存事件列表
//         const target = allEvents.find(e => e._id === eventId);
//         setEvent(target || null);
//       } catch (err) {
//         console.error("❌ 请求失败:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [buildingId, eventId]); // ✅ 当 buildingId 或 eventId 变化时重新请求

//   // Listen for "open editor" event from the left sidebar button.
//   useEffect(() => {
//     const onOpenEditor = () => setIsEditing(true);
//     window.addEventListener("app:open-editor", onOpenEditor);
//     return () => window.removeEventListener("app:open-editor", onOpenEditor);
//   }, []);

//   // Add comment (append; newest at bottom)
//   const addComment = () => {
//     const text = draft.trim();
//     if (!text) return;
//     const item = {
//       id: `c-${Date.now()}`,
//       author: "You",
//       body: text,
//       createdAt: Date.now(),
//     };
//     setPost((p) => ({ ...p, comments: [...(p?.comments || []), item] }));
//     setDraft("");
//     // auto-scroll to bottom after render
//     requestAnimationFrame(() =>
//       requestAnimationFrame(() => {
//         if (listRef.current)
//           listRef.current.scrollTop = listRef.current.scrollHeight;
//       })
//     );
//   };

//   // Delete my comment
//   const deleteComment = (id) => {
//     const c = (post?.comments || []).find((x) => x.id === id);
//     if (!c || c.author !== "You") return;
//     if (!window.confirm("Delete this comment?")) return;
//     setPost((p) => ({
//       ...p,
//       comments: (p?.comments || []).filter((x) => x.id !== id),
//     }));
//   };

//   // Delete post (author only)
//   const deletePost = () => {
//     if (!post || post.author !== "You") return;
//     if (!window.confirm("Delete this post?")) return;
//     setPost((p) =>
//       p ? { ...p, title: "[deleted]", summary: "", comments: [] } : p
//     );
//   };

//   // Like toggle (local)
//   const toggleLike = () => {
//     setLiked((v) => !v);
//     setPost((p) =>
//       p ? { ...p, likesCount: (p.likesCount || 0) + (liked ? -1 : 1) } : p
//     );
//   };

//   const isPostMine = !!post && post.author === "You";
//   const typeKey = String(post?.type || "other").toLowerCase();
//   const badgeBg = TYPE_BG[typeKey] || TYPE_BG.other;
//   const badgeFg = TYPE_FG[typeKey] || TYPE_FG.other;
//   const typeLabel = TYPE_LABEL[typeKey] || TYPE_LABEL.other;
//   const commentCount = (post?.comments || []).length;

//   // Handlers passed into PostEditor
//   const handleCancelEdit = useCallback(() => {
//     setIsEditing(false);
//   }, []);
//   const handlePublish = useCallback(
//     ({ title, type, summary }) => {
//       // TODO: replace with real API call and refetch.
//       const newPost = {
//         id: `new-${Date.now()}`,
//         building: post?.building || { id: "b-ilc", name: "ILC" },
//         author: "You",
//         type,
//         title,
//         summary,
//         createdAt: Date.now(),
//         likesCount: 0,
//         comments: [],
//       };
//       setPost(newPost);
//       setIsEditing(false);
//     },
//     [post?.building]
//   );

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         padding: "40px 60px",
//         backgroundColor: "#fafafa",
//         height: "calc(100vh - 64px)",
//         boxSizing: "border-box",
//         width: "100%",
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           width: "100%",
//           maxWidth: 1200,
//           height: "100%",
//           borderRadius: 16,
//           overflow: "hidden",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           background: "white",
//           display: "grid",
//           gridTemplateColumns: "400px 1fr",
//         }}
//       >
//         {/* Left: fixed sidebar with list and create button */}
//         <div style={{ height: "100%", minHeight: 0, display: "flex" }}>
//           <SidebarDetail
//             building={{ name: post?.building?.name ?? "", id: post?.building?.id }}
//           />
//         </div>

//         {/* Right: keep same container. We swap its inner content by mode. */}
//         <div
//           style={{
//             display: "grid",
//             // For detail mode we use two rows. For editor, the section fills all space.
//             gridTemplateRows: isEditing
//               ? "1fr"
//               : "minmax(0, 0.42fr) minmax(0, 0.58fr)",
//             rowGap: isEditing ? 0 : 4,
//             minHeight: 0,
//             height: "100%",
//             borderLeft: "1px solid #eee",
//           }}
//         >
//           {isEditing ? (
//             <PostEditor
//               building={post?.building}
//               defaultType={typeKey}
//               onCancel={handleCancelEdit}
//               onPublish={handlePublish}
//             />
//           ) : (
//             <>
//               {/* TOP: Post */}
//               <section
//                 style={{
//                   position: "relative",
//                   display: "grid",
//                   gridTemplateRows: "auto auto 1fr auto",
//                   rowGap: 8,
//                   minHeight: 0,
//                   padding: "16px 20px 16px 20px",
//                   overflow: "hidden",
//                 }}
//               >
//                 {loading ? (
//                   <div>Loading…</div>
//                 ) : (
//                   <>
//                     {/* time at absolute top-right */}
//                     <time
//                       style={{
//                         position: "absolute",
//                         top: 16,
//                         right: 20,
//                         color: "#64748b",
//                         fontSize: 13,
//                         whiteSpace: "nowrap",
//                       }}
//                       title={absTime(post?.createdAt)}
//                     >
//                       {relTime(post?.createdAt)}
//                     </time>

//                     {/* Row 1: avatar + author */}
//                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                       <Avatar name={post?.author || "U"} />
//                       <div
//                         style={{
//                           fontWeight: 600,
//                           color: "#0f172a",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                         }}
//                         title={post?.author || "Unknown"}
//                       >
//                         {post?.author || "Unknown"}
//                       </div>
//                     </div>

//                     {/* Row 2: badge + title */}
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 12,
//                           padding: "5px 10px",
//                           borderRadius: 999,
//                           background: badgeBg,
//                           color: badgeFg,
//                           whiteSpace: "nowrap",
//                           flex: "0 0 auto",
//                         }}
//                       >
//                         {typeLabel}
//                       </span>
//                       <h1
//                         style={{
//                           margin: 0,
//                           fontSize: 22,
//                           fontWeight: 800,
//                           color: "#0f172a",
//                           lineHeight: 1.25,
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                           minWidth: 0,
//                         }}
//                         title={post?.title}
//                       >
//                         {post?.title}
//                       </h1>
//                     </div>

//                     {/* Row 3: body */}
//                     <div
//                       style={{
//                         minHeight: 0,
//                         overflowY: "auto",
//                         fontSize: 15,
//                         color: "#0f172a",
//                         lineHeight: 1.6,
//                         wordBreak: "break-word",
//                         whiteSpace: "pre-wrap",
//                         marginTop: 8,
//                       }}
//                     >
//                       {post?.summary}
//                     </div>

//                     {/* Row 4: actions */}
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 16,
//                         color: "#334155",
//                       }}
//                     >
//                       <button
//                         onClick={toggleLike}
//                         title="Like"
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 6,
//                           border: "none",
//                           background: "transparent",
//                           cursor: "pointer",
//                           fontSize: 14,
//                           color: liked ? "#ef4444" : "#334155",
//                         }}
//                       >
//                         <span>{liked ? "❤️" : "🤍"}</span>
//                         <span>{post?.likesCount ?? 0}</span>
//                       </button>

//                       <div
//                         title="Comments"
//                         style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}
//                       >
//                         <span>💬</span>
//                         <span>{commentCount}</span>
//                       </div>

//                       {isPostMine && (
//                         <button
//                           onClick={deletePost}
//                           title="Delete post"
//                           style={{
//                             marginLeft: "auto",
//                             border: "none",
//                             background: "transparent",
//                             color: "#64748b",
//                             textDecoration: "underline",
//                             fontSize: 12,
//                             cursor: "pointer",
//                           }}
//                         >
//                           delete post
//                         </button>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </section>

//               {/* BOTTOM: Comments */}
//               <section
//                 style={{ display: "grid", gridTemplateRows: "auto 1fr auto", minHeight: 0 }}
//               >
//                 {/* Header */}
//                 <div
//                   style={{
//                     padding: "6px 20px 8px 20px",
//                     fontWeight: 700,
//                     fontSize: 16,
//                     color: "#0f172a",
//                     borderBottom: "1px solid #f1f5f9",
//                   }}
//                 >
//                   Comments
//                 </div>

//                 {/* List */}
//                 <div
//                   ref={listRef}
//                   style={{ padding: "12px 20px", overflowY: "auto", minHeight: 0 }}
//                 >
//                   {loading && <div>Loading…</div>}
//                   {!loading &&
//                     (post?.comments || []).map((c) => {
//                       const isMine = c.author === "You";
//                       return (
//                         <div
//                           key={c.id}
//                           style={{
//                             position: "relative",
//                             display: "grid",
//                             gridTemplateColumns: "40px 1fr",
//                             gridTemplateRows: "20px auto",
//                             columnGap: 10,
//                             rowGap: 6,
//                             padding: 12,
//                             border: "1px solid #eef2f7",
//                             borderRadius: 12,
//                             marginBottom: 10,
//                             background: "#fff",
//                           }}
//                         >
//                           <div style={{ gridRow: "1 / span 2", alignSelf: "start" }}>
//                             <Avatar name={c.author} />
//                           </div>

//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               minWidth: 0,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 fontWeight: 600,
//                                 color: "#0f172a",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 paddingRight: 8,
//                               }}
//                               title={c.author}
//                             >
//                               {c.author}
//                             </div>
//                             <time
//                               style={{
//                                 color: "#64748b",
//                                 fontSize: 12,
//                                 whiteSpace: "nowrap",
//                                 flexShrink: 0,
//                               }}
//                               title={absTime(c.createdAt)}
//                             >
//                               {relTime(c.createdAt)}
//                             </time>
//                           </div>

//                           <div
//                             style={{
//                               color: "#0f172a",
//                               fontSize: 14,
//                               lineHeight: 1.6,
//                               wordBreak: "break-word",
//                               whiteSpace: "pre-wrap",
//                               paddingRight: isMine ? 56 : 0,
//                             }}
//                           >
//                             {c.body}
//                           </div>

//                           {isMine && (
//                             <button
//                               onClick={() => deleteComment(c.id)}
//                               title="Delete"
//                               style={{
//                                 position: "absolute",
//                                 right: 12,
//                                 bottom: 8,
//                                 border: "none",
//                                 background: "transparent",
//                                 color: "#64748b",
//                                 textDecoration: "underline",
//                                 fontSize: 12,
//                                 cursor: "pointer",
//                               }}
//                             >
//                               delete
//                             </button>
//                           )}
//                         </div>
//                       );
//                     })}
//                   {!loading && (post?.comments || []).length === 0 && (
//                     <div className="muted" style={{ padding: 12 }}>
//                       No comments yet.
//                     </div>
//                   )}
//                 </div>

//                 {/* Composer */}
//                 <div
//                   style={{
//                     borderTop: "1px solid #f1f5f9",
//                     padding: "10px 20px",
//                     display: "grid",
//                     gridTemplateColumns: "1fr auto",
//                     gap: 8,
//                     alignItems: "center",
//                     background: "#fff",
//                   }}
//                 >
//                   <input
//                     placeholder="Write a comment…"
//                     value={draft}
//                     onChange={(e) => setDraft(e.target.value)}
//                     onCompositionStart={() => (window.__imeComposing = true)}
//                     onCompositionEnd={() => (window.__imeComposing = false)}
//                     onKeyDown={(e) => {
//                       const composing = window.__imeComposing;
//                       if (!composing && e.key === "Enter") {
//                         e.preventDefault();
//                         addComment();
//                       }
//                     }}
//                     style={{
//                       height: 40,
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 10,
//                       padding: "0 12px",
//                       outline: "none",
//                       fontSize: 14,
//                     }}
//                   />
//                   <button className="btn-primary" onClick={addComment} title="Send">
//                     Send
//                   </button>
//                 </div>
//               </section>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

