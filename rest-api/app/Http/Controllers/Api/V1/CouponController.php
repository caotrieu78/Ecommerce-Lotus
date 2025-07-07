<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    //  Danh sách tất cả mã giảm giá
    public function index()
    {
        return response()->json(Coupon::all());
    }

    //  Lấy thông tin 1 mã giảm giá
    public function show($id)
    {
        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['message' => 'Không tìm thấy mã giảm giá'], 404);
        }

        return response()->json($coupon);
    }

    //  Thêm mới mã giảm giá (admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Code' => 'required|string|max:50|unique:Coupons,Code',
            'DiscountType' => 'required|in:percentage,fixed',
            'DiscountValue' => 'required|numeric|min:0.01',
            'ExpirationDate' => 'required|date|after:now',
            'MinOrderValue' => 'required|numeric|min:0',
            'IsActive' => 'boolean',
        ]);

        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    //  Cập nhật mã giảm giá (admin)
    public function update(Request $request, $id)
    {
        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['message' => 'Không tìm thấy mã giảm giá'], 404);
        }

        $validated = $request->validate([
            'Code' => 'sometimes|string|max:50|unique:Coupons,Code,' . $id . ',CouponID',
            'DiscountType' => 'sometimes|in:percentage,fixed',
            'DiscountValue' => 'sometimes|numeric|min:0.01',
            'ExpirationDate' => 'sometimes|date|after:now',
            'MinOrderValue' => 'sometimes|numeric|min:0',
            'IsActive' => 'boolean',
        ]);

        $coupon->update($validated);
        return response()->json($coupon);
    }

    //  Xoá mã giảm giá (admin)
    public function destroy($id)
    {
        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['message' => 'Không tìm thấy mã giảm giá'], 404);
        }

        $coupon->delete();
        return response()->json(['message' => 'Đã xoá mã giảm giá']);
    }

    //  Kiểm tra mã giảm giá hợp lệ khi người dùng nhập (public API)
    public function validateCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'order_total' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('Code', $validated['code'])
            ->where('IsActive', true)
            ->where('ExpirationDate', '>', now())
            ->first();

        if (!$coupon) {
            return response()->json(['message' => 'Mã giảm giá không hợp lệ hoặc đã hết hạn'], 404);
        }

        if ($validated['order_total'] < $coupon->MinOrderValue) {
            return response()->json([
                'message' => 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá',
                'min_order' => $coupon->MinOrderValue
            ], 400);
        }

        return response()->json([
            'message' => 'Mã giảm giá hợp lệ',
            'coupon' => $coupon
        ]);
    }
}
