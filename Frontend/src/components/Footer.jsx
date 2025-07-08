import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 pb-8 border-b border-gray-200">
          <div className="mb-6 lg:mb-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Đăng ký nhận tin
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="px-4 py-3 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
              <button
                onClick={handleSubscribe}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                ĐĂNG KÝ
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Kết nối với chúng tôi</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-200 hover:bg-pink-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300">
                  <Facebook size={16} />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-pink-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300">
                  <Twitter size={16} />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-pink-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300">
                  <Instagram size={16} />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-pink-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300">
                  <Mail size={16} />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-pink-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300">
                  <Youtube size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Về Lotus Japan Mall
            </h4>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Lotus Japan Mall thuộc Công ty Cổ phần Tập đoàn Thực phẩm Hoa Sen Số đăng ký kinh doanh: 0312949668
              </p>
              <div className="flex items-start gap-3">
                <MapPin className="text-pink-500 mt-1 flex-shrink-0" size={16} />
                <span>9-9A Nơ Trang Long, Phường 7, Quận Bình Thạnh, Thành phố Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-pink-500" size={16} />
                <span>0906 990 117</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-pink-500" size={16} />
                <span>info@lotusjapanmall.com.vn</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Danh mục sản phẩm
            </h4>
            <ul className="space-y-3">
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
                  <button
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Chính sách
            </h4>
            <ul className="space-y-3">
              {[
                "Tìm kiếm",
                "Giới thiệu",
                "Chính sách chung",
                "Chính sách bảo mật",
                "Chính sách đổi trả",
                "Chính sách vận chuyển",
                "Điều khoản dịch vụ",
                "Quyền và nghĩa vụ dại bên",
                "Quy trình cung cấp dịch vụ",
                "Chính sách bảo mật thanh toán"
              ].map((item, index) => (
                <li key={index}>
                  <button
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Fanpage */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
              Fanpage
            </h4>
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop"
                  alt="Lotus Japan Mall Fanpage"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h5 className="font-bold text-lg mb-1">Lotus Japan Mall</h5>
                  <p className="text-sm opacity-90">50 người theo dõi</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium cursor-pointer transition-colors">
                      Theo dõi Trang
                    </div>
                    <div className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm font-medium cursor-pointer transition-colors">
                      Chia sẻ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-pink-500 hover:bg-pink-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;