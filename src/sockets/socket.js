module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-stream", (streamId) => {
      socket.join(`stream_${streamId}`);
      console.log(`User joined stream: ${streamId}`);
    });

    socket.on("send-comment", (data) => {
      // data: { streamId, user, message }
      io.to(`stream_${data.streamId}`).emit("new-comment", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};