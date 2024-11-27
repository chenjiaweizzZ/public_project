Page({

  // 其他代码
  data: {
    currentConversationID: "",
    unreadCount: "",
    consultId: "",
    type: "1",
    patientName: "",
    patientId: "",
    sourceId: ""
  },
  onLoad(e) {
    this.setData({
      currentConversationID: `GROUP${e.currentConversationID}`,
      unreadCount: e.unreadCount,
      consultId: e.consultId,
      type: e.type,
      patientName: e.patientName,
      patientId: e.patientId,
      sourceId: e.sourceId
    })
  },
});