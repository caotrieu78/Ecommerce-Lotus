<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SellerInfo;
use Illuminate\Support\Facades\Auth;

class SellerInfoController extends Controller
{
    public function __construct()
    {
        // Bắt buộc phải đăng nhập
        $this->middleware('auth:sanctum');

        // Chỉ seller mới được thêm/sửa/xoá nhãn hàng của chính mình
        $this->middleware('seller')->only(['store', 'update', 'destroy']);

        // Admin có thể dùng middleware trong routes/api.php để truy cập index/show
    }

    /**
     * ✅ Admin: Xem danh sách tất cả nhãn hàng
     */
    public function index()
    {
        return response()->json(SellerInfo::all());
    }

    /**
     * ✅ Admin: Xem chi tiết nhãn hàng
     */
    public function show($id)
    {
        $seller = SellerInfo::find($id);
        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }
        return response()->json($seller);
    }

    /**
     * ✅ Seller: Xem thông tin nhãn hàng của chính mình
     */
    public function getMyInfo()
    {
        $user = Auth::user();
        $info = SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$info) {
            return response()->json(['message' => 'Bạn chưa có nhãn hàng'], 404);
        }

        return response()->json($info);
    }

    /**
     * ✅ Seller: Tạo thông tin nhãn hàng (mỗi seller chỉ 1)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (SellerInfo::where('SellerID', $user->UserID)->exists()) {
            return response()->json(['message' => 'Nhãn hàng đã tồn tại'], 409);
        }

        $validated = $request->validate([
            'StoreName'   => 'required|string|max:100',
            'Description' => 'nullable|string',
            'LogoURL'     => 'nullable|url|max:255',
            'Address'     => 'nullable|string|max:300',
            'Phone'       => 'nullable|string|max:20',
            'Email'       => 'nullable|email|max:100',
        ]);

        $seller = SellerInfo::create([
            'SellerID' => $user->UserID,
            ...$validated
        ]);

        return response()->json($seller, 201);
    }

    /**
     * ✅ Seller: Cập nhật thông tin nhãn hàng của chính mình
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $seller = SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }

        $validated = $request->validate([
            'StoreName'   => 'sometimes|string|max:100',
            'Description' => 'nullable|string',
            'LogoURL'     => 'nullable|url|max:255',
            'Address'     => 'nullable|string|max:300',
            'Phone'       => 'nullable|string|max:20',
            'Email'       => 'nullable|email|max:100',
        ]);

        $seller->update($validated);
        return response()->json($seller);
    }

    /**
     * ✅ Seller: Xoá thông tin nhãn hàng của mình
     */
    public function destroy()
    {
        $user = Auth::user();
        $seller = SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }

        $seller->delete();
        return response()->json(['message' => 'Đã xoá nhãn hàng']);
    }
}
