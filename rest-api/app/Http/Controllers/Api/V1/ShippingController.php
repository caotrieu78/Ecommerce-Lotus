<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Shipping;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShippingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Tạo thông tin vận chuyển cho đơn hàng
    public function store(Request $request)
    {
        $validated = $request->validate([
            'OrderID' => 'required|exists:Orders,OrderID',
            'RecipientName' => 'required|string|max:100',
            'Phone' => 'required|string|max:20',
            'Address' => 'required|string|max:300',
            'City' => 'required|string|max:100',
        ]);

        $order = Order::find($validated['OrderID']);

        if (!$order || $order->UserID !== Auth::id()) {
            return response()->json(['message' => 'Bạn không có quyền tạo vận chuyển cho đơn hàng này'], 403);
        }

        if (Shipping::where('OrderID', $order->OrderID)->exists()) {
            return response()->json(['message' => 'Đơn hàng đã có thông tin vận chuyển'], 409);
        }

        $shipping = Shipping::create([
            ...$validated,
            'ShippingStatus' => 'Processing',
        ]);

        return response()->json([
            'message' => 'Đã thêm thông tin vận chuyển',
            'shipping' => $shipping
        ], 201);
    }

    // Người dùng xem vận chuyển theo OrderID
    public function showByOrder($orderId)
    {
        $shipping = Shipping::where('OrderID', $orderId)
            ->with('order')
            ->first();

        if (!$shipping) {
            return response()->json(['message' => 'Không tìm thấy thông tin vận chuyển'], 404);
        }

        // Admin xem tất cả, người dùng chỉ xem đơn của mình
        if (Auth::user()->RoleID !== 1 && $shipping->order->UserID !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền truy cập vận chuyển này'], 403);
        }

        return response()->json($shipping);
    }

    // Admin cập nhật trạng thái vận chuyển
    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->RoleID !== 1) {
            return response()->json(['message' => 'Chỉ admin mới có quyền cập nhật vận chuyển'], 403);
        }

        $shipping = Shipping::find($id);
        if (!$shipping) {
            return response()->json(['message' => 'Không tìm thấy thông tin vận chuyển'], 404);
        }

        $validated = $request->validate([
            'ShippingStatus' => 'required|string|max:50',
            'ShippedAt' => 'nullable|date',
            'DeliveredAt' => 'nullable|date',
        ]);

        $shipping->update($validated);

        return response()->json([
            'message' => 'Cập nhật trạng thái vận chuyển thành công',
            'shipping' => $shipping
        ]);
    }
}
