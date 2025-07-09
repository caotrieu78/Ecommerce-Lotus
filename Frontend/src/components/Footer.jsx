import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setChatMessages([
        { type: "bot", text: "Xin chào! Hãy đặt câu hỏi để được hỗ trợ." }
      ]);
    }
  };

  // Mock JSON data for chat responses
  const chatResponses = [
    {
      question: "Thời gian giao hàng bao lâu?",
      keywords: ["giao hàng", "thời gian", "bao lâu"],
      answer:
        "Thời gian giao hàng thường từ 2-5 ngày làm việc, tùy thuộc vào khu vực."
    },
    {
      question: "Có chính sách đổi trả không?",
      keywords: ["đổi trả", "chính sách", "hoàn trả"],
      answer:
        "Có, chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả."
    },
    {
      question: "Làm sao để nhận mã giảm giá?",
      keywords: ["mã giảm giá", "khuyến mãi", "voucher"],
      answer:
        "Bạn có thể đăng ký nhận tin qua email hoặc theo dõi fanpage để nhận mã giảm giá mới nhất."
    },
    {
      question: "Sản phẩm có chính hãng không?",
      keywords: ["chính hãng", "hàng thật", "authentic"],
      answer:
        "Tất cả sản phẩm tại Lotus Japan Mall đều cam kết 100% chính hãng."
    }
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user's message to chat
    setChatMessages([...chatMessages, { type: "user", text: chatInput }]);

    // Search for matching response
    const inputLower = chatInput.toLowerCase();
    const matchedResponse = chatResponses.find((response) =>
      response.keywords.some((keyword) =>
        inputLower.includes(keyword.toLowerCase())
      )
    );

    // Add bot's response
    const botMessage = matchedResponse
      ? { type: "bot", text: matchedResponse.answer }
      : {
        type: "bot",
        text: "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại!"
      };

    setChatMessages((prev) => [...prev, botMessage]);
    setChatInput("");
  };

  return (
    <footer className="bg-white text-gray-800 py-16 font-sans">
      <style>
        {`
          .chat-window {
            animation: slideUp 0.3s ease-out;
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .chat-window::-webkit-scrollbar {
            width: 6px;
          }
          .chat-window::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .chat-window::-webkit-scrollbar-thumb {
            background: #f72585;
            border-radius: 3px;
          }
          .chat-window::-webkit-scrollbar-thumb:hover {
            background: #ff477e;
          }
          .chat-message-user {
            background: #fce7f3;
            color: #1f2937;
            border-radius: 12px 12px 0 12px;
          }
          .chat-message-bot {
            background: #f3f4f6;
            color: #1f2937;
            border-radius: 12px 12px 12px 0;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Đăng ký nhận tin
              </h3>
              <p className="text-gray-500 text-sm">
                Nhận thông tin mới nhất về sản phẩm và khuyến mãi
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="px-4 py-3 w-full sm:w-80 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                onClick={handleSubscribe}
                className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
              >
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Về Lotus Japan Mall
            </h4>
            <div className="space-y-4 text-gray-600 text-sm">
              <p className="leading-relaxed">
                Lotus Japan Mall thuộc Công ty Cổ phần Tập đoàn Thực phẩm Hoa
                Sen Số đăng ký kinh doanh: 0312949668
              </p>
              <div className="flex items-start gap-3">
                <MapPin
                  className="text-pink-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <span>
                  9-9A Nơ Trang Long, Phường 7, Quận Bình Thạnh, Thành phố Hồ
                  Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-pink-400" size={16} />
                <span>0906 990 117</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-pink-400" size={16} />
                <span>info@lotusjapanmall.com.vn</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Danh mục sản phẩm
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Thực phẩm",
                "Mẹ và Bé",
                "Hóa mỹ phẩm",
                "Nhà cửa đời sống",
                "Thực phẩm bảo vệ sức khỏe",
                "Sản phẩm khuyến mãi",
                "Hàng mới về"
              ].map((item, index) => (
                <li key={index}>
                  <button className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Chính sách
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Tìm kiếm",
                "Giới thiệu",
                "Chính sách chung",
                "Chính sách bảo mật",
                "Chính sách đổi trả",
                "Chính sách vận chuyển",
                "Điều khoản dịch vụ",
                "Quyền và nghĩa vụ đại bên",
                "Quy trình cung cấp dịch vụ",
                "Chính sách bảo mật thanh toán"
              ].map((item, index) => (
                <li key={index}>
                  <button className="text-gray-600 hover:text-pink-400 transition-colors duration-300 text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Fanpage */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Fanpage
            </h4>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop"
                  alt="Lotus Japan Mall Fanpage"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h5 className="font-bold text-lg mb-1">Lotus Japan Mall</h5>
                  <p className="text-xs opacity-90">50 người theo dõi</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="bg-pink-400 hover:bg-pink-500 px-3 py-1 rounded text-xs font-medium text-white transition-colors">
                      Theo dõi Trang
                    </button>
                    <button className="bg-white hover:bg-gray-100 text-pink-400 px-3 py-1 rounded text-xs font-medium transition-colors border border-pink-200">
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium text-sm">
              Kết nối với chúng tôi
            </span>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-gray-50 hover:bg-pink-400 rounded-full flex items-center justify-center text-pink-400 hover:text-white transition-all duration-300 shadow-sm border border-gray-200">
                <Facebook size={16} />
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-pink-400 rounded-full flex items-center justify-center text-pink-400 hover:text-white transition-all duration-300 shadow-sm border border-gray-200">
                <Twitter size={16} />
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-pink-400 rounded-full flex items-center justify-center text-pink-400 hover:text-white transition-all duration-300 shadow-sm border border-gray-200">
                <Instagram size={16} />
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-pink-400 rounded-full flex items-center justify-center text-pink-400 hover:text-white transition-all duration-300 shadow-sm border border-gray-200">
                <Youtube size={16} />
              </button>
            </div>
          </div>
          <div className="text-gray-600 text-sm text-center">
            © {new Date().getFullYear()} Lotus Japan Mall. All rights reserved.
          </div>
        </div>
      </div>

      {/* Chat Button & Window */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-pink-400 hover:bg-pink-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isChatOpen && (
          <div className="chat-window absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
            <div className="bg-pink-400 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h4 className="text-sm font-semibold">Hỗ trợ khách hàng</h4>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 text-sm ${message.type === "user"
                    ? "chat-message-user ml-auto max-w-[80%]"
                    : "chat-message-bot mr-auto max-w-[80%]"
                    }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleChatSubmit}
              className="p-4 border-t border-gray-100"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="bg-pink-400 hover:bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
