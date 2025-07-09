<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\SellerInfo;

class SellerInfoController extends Controller
{
    public function __construct()
    {
        // Chỉ bắt buộc đăng nhập với các phương thức khác index/show
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    // ✅ Public: Xem tất cả nhãn hàng
    public function index()
    {
        return response()->json(SellerInfo::all());
    }

    // ✅ Public: Xem chi tiết nhãn hàng theo ID
    public function show($id)
    {
        $seller = SellerInfo::find($id);
        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }
        return response()->json($seller);
    }

    public function getMyInfo()
    {
        $user = Auth::user();
        $info = SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$info) {
            return response()->json(['message' => 'Bạn chưa có nhãn hàng'], 404);
        }

        return response()->json($info);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isAdmin = $user->RoleID == 1;

        $sellerId = $isAdmin ? $request->input('SellerID') : $user->UserID;

        if (!$sellerId) {
            return response()->json(['message' => 'Thiếu SellerID'], 422);
        }

        if (SellerInfo::where('SellerID', $sellerId)->exists()) {
            return response()->json(['message' => 'Nhãn hàng đã tồn tại'], 409);
        }

        $validated = $request->validate([
            'StoreName'   => 'required|string|max:100',
            'Description' => 'nullable|string',
            'Logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'Address'     => 'nullable|string|max:300',
            'Phone'       => 'nullable|string|max:20',
            'Email'       => 'nullable|email|max:100',
        ]);

        if ($request->hasFile('Logo')) {
            $file = $request->file('Logo');
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/branch'), $filename);
            $validated['LogoURL'] = url('images/branch/' . $filename);
        }

        $validated['SellerID'] = $sellerId;

        $seller = SellerInfo::create($validated);
        return response()->json($seller, 201);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $isAdmin = $user->RoleID == 1;

        $seller = $isAdmin
            ? SellerInfo::find($request->input('SellerID'))
            : SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }

        $validated = $request->validate([
            'StoreName'   => 'sometimes|string|max:100',
            'Description' => 'nullable|string',
            'Logo'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'Address'     => 'nullable|string|max:300',
            'Phone'       => 'nullable|string|max:20',
            'Email'       => 'nullable|email|max:100',
        ]);

        if ($request->hasFile('Logo')) {
            if ($seller->LogoURL) {
                $oldPath = public_path(parse_url($seller->LogoURL, PHP_URL_PATH));
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $file = $request->file('Logo');
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/branch'), $filename);
            $validated['LogoURL'] = url('images/branch/' . $filename);
        }

        $seller->update($validated);
        return response()->json($seller);
    }

    public function destroy()
    {
        $user = Auth::user();
        $seller = SellerInfo::where('SellerID', $user->UserID)->first();

        if (!$seller) {
            return response()->json(['message' => 'Không tìm thấy nhãn hàng'], 404);
        }

        if ($seller->LogoURL) {
            $oldPath = public_path(parse_url($seller->LogoURL, PHP_URL_PATH));
            if (File::exists($oldPath)) {
                File::delete($oldPath);
            }
        }

        $seller->delete();
        return response()->json(['message' => 'Đã xoá nhãn hàng']);
    }
}