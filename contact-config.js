/* Single source for Mika contact channels. UI reads this object only. */
(function (global) {
  global.MIKA_CONTACT = {
    whatsapp: {
      label: "WhatsApp",
      display: "+86 138 1401 5518",
      href: "https://wa.me/8613814015518",
      copyValue: "+86 138 1401 5518",
      action: "Chat on WhatsApp",
      actionAria: "Contact us on WhatsApp"
    },
    email: {
      label: "Email",
      display: "akizukiovo@gmail.com",
      href: "mailto:akizukiovo@gmail.com",
      copyValue: "akizukiovo@gmail.com",
      action: "Send an email",
      actionAria: "Send an email"
    },
    wechat: {
      label: "WeChat",
      display: "Xue2017105",
      copyValue: "Xue2017105",
      action: "Copy WeChat ID",
      actionAria: "Copy WeChat ID",
      /* Reserved. Set to an image path later to show "View QR Code". */
      wechatQrAsset: null
    }
  };
})(window);
