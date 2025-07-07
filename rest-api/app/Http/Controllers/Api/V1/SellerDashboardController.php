<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SellerProductStat;
use App\Models\SellerEarning;
use Illuminate\Http\Request;

class SellerDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    //  Tổng hợp doanh thu seller hiện tại
    public function earnings()
    {
        $sellerId = auth()->id();

        $total = SellerEarning::where('SellerID', $sellerId)->sum('Amount');
        $pending = SellerEarning::where('SellerID', $sellerId)->where('PayoutStatus', 'Pending')->sum('Amount');

        return response()->json([
            'TotalEarnings' => $total,
            'PendingPayouts' => $pending,
        ]);
    }

    //  Danh sách sản phẩm và hiệu suất của seller
    public function productStats()
    {
        $stats = SellerProductStat::with('product')
            ->where('SellerID', auth()->id())
            ->get();

        return response()->json($stats);
    }
}