<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;

class UserActivityLogController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    //  Lấy lịch sử hành động của người dùng hiện tại
    public function index()
    {
        $logs = UserActivityLog::where('UserID', auth()->id())
            ->orderByDesc('CreatedAt')
            ->limit(100)
            ->get();

        return response()->json($logs);
    }

    //  Ghi log mới (dùng ở nhiều nơi khác như đặt hàng, thêm sản phẩm,...)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ActionType' => 'required|string|max:50',
            'ReferenceID' => 'nullable|integer',
            'Metadata' => 'nullable|array',
        ]);

        $log = UserActivityLog::create([
            'UserID' => auth()->id(),
            'ActionType' => $validated['ActionType'],
            'ReferenceID' => $validated['ReferenceID'] ?? null,
            'Metadata' => $validated['Metadata'] ?? [],
        ]);

        return response()->json(['message' => 'Đã ghi log thành công'], 201);
    }
}
