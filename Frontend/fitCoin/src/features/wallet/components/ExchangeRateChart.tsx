'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeries,
} from 'lightweight-charts';

interface RateHistory {
  timestamp: string;
  rate: number;
}

interface ExchangeRateChartProps {
  data: RateHistory[];
}

const PERIODS = [
  { label: '전체', days: null },
  { label: '1년', days: 365 },
  { label: '3개월', days: 90 },
  { label: '1개월', days: 30 },
  { label: '1주', days: 7 },
] as const;

export default function ExchangeRateChart({ data }: ExchangeRateChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [activePeriod, setActivePeriod] = useState<string>('전체');

  const allLineData = data
    .map((item) => ({
      time: Number(item.timestamp) as any,
      value: item.rate,
    }))
    .sort((a, b) => a.time - b.time);

  const getFilteredData = (days: number | null) => {
    if (!days || allLineData.length === 0) return allLineData;
    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec = nowSec - days * 86400;
    return allLineData.filter((d) => (d.time as number) >= fromSec);
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#888',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#e5e7eb', style: 1 },
        horzLines: { color: '#e5e7eb', style: 1 },
      },
      leftPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      rightPriceScale: { visible: false },
      localization: {
        priceFormatter: (price: number) =>
          Math.floor(price).toLocaleString('ko-KR'),
        timeFormatter: (time: number) => {
          const d = new Date(time * 1000);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        rightOffset: 5,
        tickMarkFormatter: (time: number) => {
          const d = new Date(time * 1000);
          return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
      priceScaleId: 'left',
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    series.setData(allLineData);
    chart.timeScale().fitContent();

    // TradingView 워터마크 숨김 (비동기 삽입 대응)
    const hideWatermark = () => {
      const el = chartContainerRef.current?.querySelector(
        'a[href*="tradingview"]',
      );
      if (el) (el as HTMLElement).style.display = 'none';
    };
    hideWatermark();
    const mutationObserver = new MutationObserver(hideWatermark);
    mutationObserver.observe(chartContainerRef.current, {
      childList: true,
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight, // 추가
        });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    const period = PERIODS.find((p) => p.label === activePeriod);
    const filtered = getFilteredData(period?.days ?? null);
    seriesRef.current.setData(filtered);
    chartRef.current.timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod, data]);

  return (
    <div
      style={{
        marginTop: '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 기간 필터 탭 */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        {PERIODS.map((p) => (
          <button
            key={p.label}
            onClick={() => setActivePeriod(p.label)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '12px',
              fontWeight: activePeriod === p.label ? 700 : 500,
              cursor: 'pointer',
              background:
                activePeriod === p.label
                  ? 'var(--color-primary)'
                  : 'transparent',
              color:
                activePeriod === p.label
                  ? '#fff'
                  : 'var(--color-text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 차트 컨테이너 */}
      <div
        style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          ref={chartContainerRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
