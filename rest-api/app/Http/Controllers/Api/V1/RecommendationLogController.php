<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\RecommendationLog;
use Illuminate\Http\Request;

class RecommendationLogController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    //  Ghi nhận sản phẩm được gợi ý
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ProductID' => 'required|exists:Product,ProductID',
        ]);

        RecommendationLog::create([
            'UserID' => auth()->id(),
            'ProductID' => $validated['ProductID'],
            'WasClicked' => false,
        ]);

        return response()->json(['message' => 'Đã ghi log gợi ý'], 201);
    }

    //  Ghi nhận khi người dùng click vào sản phẩm được gợi ý
    public function markClicked(Request $request)
    {
        $validated = $request->validate([
            'RecID' => 'required|exists:RecommendationLogs,RecID',
        ]);

        $log = RecommendationLog::where('RecID', $validated['RecID'])
            ->where('UserID', auth()->id())
            ->first();

        if ($log) {
            $log->WasClicked = true;
            $log->save();
        }

        return response()->json(['message' => 'Đã cập nhật trạng thái click']);
    }
}
