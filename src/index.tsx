import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from public/static directory
app.use('/static/*', serveStatic({ root: './public' }))

// Mock staff/user data for schedule
const mockScheduleData = [
  {
    id: 'S001',
    name: 'サラ・ジェンキンス',
    role: 'サービス管理責任者',
    type: 'staff',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqhSH4PvKxjtOwHWBF5ga3Nz2kGXpxV50O4zrxk3svVEX5g44iRzvpQ4zsalM2ln92Vs2ZDDputXiPSzfg7Bb5oBQcBa6UdJ83hX-pA4jzeR49wlbia248Cokgt9QNWsIXEKB1aQTeZSECvAReIjKQBnah0gtHPWe8iOhnF52QaluoE0snPgZcnCbh1pFJU1yGJfzhPKa0DmQIiGuZ_jsMxu13_jbjiE9of1YlTEmom2BSJIO7p5XDcHpkKdt3ob9B6dWhymOdqEr4',
    schedule: [
      { time: '09:00 - 17:00', location: '面談室A', transport: 'A便' },
      { time: '09:00 - 17:00', location: '応援配置', transport: '社1', highlight: true },
      null,
      { time: '13:00 - 21:00', location: '別館B', transport: '自力' },
      null, null, null
    ]
  },
  {
    id: 'U001',
    name: 'マイク・トンプソン',
    role: '施設外就労',
    type: 'member',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3gYKuxIdgVht3xspwigrkPixPOPYJpRZQrhonSieBSBdmTDHpmVVvTYxQgfQCDGeIxp2Ss6AcyenMWXAOtTUPpyon47g_koTeoyIAn66o7UTjloS3Qh7g7br9Ph8xyYI4XPGFqlKV8nNNQZ_8aZeuB9m2TDOJPrku_f9kANAKnV25R4e0ofThKpFLjSeXpYqWJQYeVlBnkEFjDKvdSnJ6-rJdlRjCb1TLvJG1P7msXbk7QD0VbvN7Np_YTrqbhsi68R5ofJ-RdTq4',
    schedule: [
      null,
      { time: '10:00 - 15:00', location: '通院予定', transport: '送迎', violation: true },
      { time: '10:00 - 15:00', location: '清掃作業', transport: 'B便' },
      null, null, null, null
    ]
  },
  {
    id: 'U002',
    name: 'エミリー・チェン',
    role: '内職班',
    type: 'member',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN9BhISrVIgyWJEX2w2MeYnwWwWNKj3diCOsSniWNnhLIoi8ztL6RGzTMpuWch8sRBZp9KX1Uk1-9Gg3AiBBOaRbC18tom0MMAd5o9HQgRB9970yGBvjwf14ZseBWZVFFkCnTlaQ2-xBQGPduqggUhgq9dtPGiimQ-qsqzUT3Bp4zx1uym4LP1L8sNL458XcrAFU9S3HOylh8jZqwFQEYya4W-jMDmBG5pHYmiTCP-pqDiqzPn7bO2ZS6bnuYR9mIiQVUk73kRd5lr',
    schedule: [
      { time: '10:00 - 15:00', location: '箱詰め', transport: '徒歩' },
      { time: '10:00 - 15:00', location: '箱詰め', transport: '徒歩' },
      { time: '10:00 - 15:00', location: '箱詰め', transport: '徒歩' },
      null, null, null, null
    ]
  }
]

// Dashboard route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html class="dark" lang="ja">
    <head>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>AI Shift Management Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#2bee79",
                            "primary-dark": "#1fa855",
                            "background-light": "#f6f8f7",
                            "background-dark": "#101418",
                            "surface-dark": "#1c232b",
                            "surface-lighter": "#2a343e",
                            "violation": "#fb4e6d",
                            "warning": "#fbbd23",
                            "member-badge": "#60a5fa",
                            "staff-badge": "#34d399",
                        },
                        fontFamily: {
                            "display": ["Spline Sans", "sans-serif"],
                            "body": ["Noto Sans JP", "Noto Sans", "sans-serif"]
                        },
                        borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                    },
                },
            }
        </script>
        <style>
            .custom-scrollbar::-webkit-scrollbar {
                height: 8px;
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #1c232b;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #2a343e;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #3b4754;
            }
            .cursor-grab {
                cursor: grab;
            }
            .cursor-grab:active {
                cursor: grabbing;
            }
        </style>
    </head>
    <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body h-screen flex flex-col overflow-hidden">
        <header class="flex items-center justify-between border-b border-white/5 bg-surface-dark px-6 py-3 shrink-0 z-20">
            <div class="flex items-center gap-4 text-white">
                <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                    <span class="material-symbols-outlined text-[28px]">smart_toy</span>
                </div>
                <div>
                    <h1 class="text-white text-lg font-bold leading-tight">AIシフトマネージャー</h1>
                    <p class="text-slate-400 text-xs font-medium">就労継続支援A型版 • v2.7</p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <nav class="hidden md:flex gap-1 bg-surface-lighter/50 p-1 rounded-full">
                    <a href="/" class="px-4 py-1.5 rounded-full bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20">ダッシュボード</a>
                    <a href="/staff" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">スタッフ管理</a>
                    <a href="/reports" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">実績報告</a>
                    <a href="/settings" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">設定</a>
                </nav>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex items-center gap-3">
                    <button class="flex items-center justify-center size-10 rounded-full bg-surface-lighter hover:bg-white/10 text-white transition-colors relative">
                        <span class="material-symbols-outlined text-[20px]">notifications</span>
                        <span class="absolute top-2 right-2.5 size-2 bg-violation rounded-full border border-surface-dark"></span>
                    </button>
                    <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-lighter" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-WSH1EuyyZnDvoTV0JfaeDXLoNOuD775YD06CTRVQImf7nWdzNOM5sDeReXDFUunR277CPcny0vMudsU5g2baEiJcMv97ZjQuF-pjsykzbJ3W5Dg5rJ7c359KrbKxW1xz-C-X8KV7-YZw2hFiwpGUGhevlVQxAcCaAvujjRgxvyBwhzR7FuRF8YzNWLaeXkj5e7uzZUg3_XC9CHZTvZGOV-2S_P0Wf4Q9YWxRrG3I05PALIsNbTfwl0uGcmpDYeWGTdk7faQ7GyJw");'></div>
                </div>
            </div>
        </header>

        <main class="flex flex-1 overflow-hidden">
            <!-- AI Command Center Sidebar -->
            <aside class="w-[380px] min-w-[320px] flex flex-col border-r border-white/5 bg-surface-dark relative z-10 shrink-0">
                <div class="px-6 py-5 border-b border-white/5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-white text-xl font-bold flex items-center gap-2">
                            コマンドセンター
                            <span class="flex size-2 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span class="relative inline-flex rounded-full size-2 bg-primary"></span>
                            </span>
                        </h2>
                        <span class="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">稼働中</span>
                    </div>
                    <div class="flex gap-2 overflow-x-auto pb-1">
                        <button class="flex items-center gap-2 px-3 py-2 bg-surface-lighter hover:bg-white/10 rounded-full text-xs font-bold text-white transition-colors whitespace-nowrap border border-white/5">
                            <span class="material-symbols-outlined text-[16px]">upload_file</span>
                            実績取込
                        </button>
                        <button class="flex items-center gap-2 px-3 py-2 bg-surface-lighter hover:bg-white/10 rounded-full text-xs font-bold text-white transition-colors whitespace-nowrap border border-white/5">
                            <span class="material-symbols-outlined text-[16px]">download</span>
                            日報出力
                        </button>
                        <button class="flex items-center gap-2 px-3 py-2 bg-surface-lighter hover:bg-white/10 rounded-full text-xs font-bold text-white transition-colors whitespace-nowrap border border-white/5">
                            <span class="material-symbols-outlined text-[16px]">check_circle</span>
                            シフト確定
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
                    <div class="flex items-center justify-center gap-4">
                        <div class="h-px bg-white/10 flex-1"></div>
                        <span class="text-slate-500 text-xs font-medium">今日 10:23</span>
                        <div class="h-px bg-white/10 flex-1"></div>
                    </div>

                    <!-- AI Message -->
                    <div class="flex items-end gap-3">
                        <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
                        </div>
                        <div class="flex flex-col gap-1 items-start max-w-[85%]">
                            <span class="text-slate-400 text-xs ml-1">AIアシスタント</span>
                            <div class="bg-surface-lighter p-3 rounded-2xl rounded-bl-none text-sm text-slate-200 leading-relaxed border border-white/5 shadow-sm">
                                予定表の分析が完了しました。作業エリアB（内職班）で<span class="text-violation font-bold">配置基準（7.5:1）を下回る日</span>が見つかりました。
                                <br/><br/>
                                職員の再配置案を表示しますか？
                            </div>
                        </div>
                    </div>

                    <!-- User Message -->
                    <div class="flex items-end gap-3 justify-end">
                        <div class="flex flex-col gap-1 items-end max-w-[85%]">
                            <span class="text-slate-400 text-xs mr-1">管理者</span>
                            <div class="bg-primary/20 p-3 rounded-2xl rounded-br-none text-sm text-white leading-relaxed border border-primary/10 shadow-sm">
                                不足箇所を表示し、応援スタッフを使用した修正案を提示してください。
                            </div>
                        </div>
                        <div class="size-8 rounded-full bg-surface-lighter flex items-center justify-center text-slate-300 shrink-0 border border-white/5 bg-cover" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtqVndlm03g47mlS9ho55Ba2ummM0JR293veXd1755RCCuvGPGGFmRCtFVxO2oxkpCivhhF3iC2cR3X0uxjx3tTVGmkmQI_pch1cRfrfth3d-WB8VKLHHRy6DWTqPfXoQ0BDs5dLcrn4Hiu_8_xD5oeQZOfsFaxFWctqKpiiEqljHjAE8hpRJddYNJJL9Kju7lii4F1chYtqrhn5ifKArAfHlFXJ57ur-ZgJaWeVuNKLb7gXxHgDHxveAb8WBKHtXwA5RYgorunlUP");'></div>
                    </div>

                    <!-- AI Proposal Message -->
                    <div class="flex items-end gap-3">
                        <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
                        </div>
                        <div class="flex flex-col gap-1 items-start max-w-[90%]">
                            <span class="text-slate-400 text-xs ml-1">AIアシスタント</span>
                            <div class="bg-surface-lighter p-4 rounded-2xl rounded-bl-none text-sm text-slate-200 border border-white/5 shadow-sm w-full">
                                <p class="mb-3">提案プランはこちらです。グリッドに変更箇所をハイライトしました。</p>
                                <div class="bg-background-dark rounded-xl p-3 border border-white/5 mb-3">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="size-8 rounded-full bg-surface-lighter flex items-center justify-center text-violation">
                                            <span class="material-symbols-outlined text-[16px]">warning</span>
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-xs text-slate-400">配置基準違反の恐れ</div>
                                            <div class="text-sm font-bold text-white">内職班 - 11月2日</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between text-xs text-slate-400 pl-11">
                                        <span>追加: <span class="text-primary">職業指導員</span></span>
                                        <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">+1名</span>
                                    </div>
                                </div>
                                <button class="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors border border-primary/20">
                                    変更を適用
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Command Input -->
                <div class="p-4 border-t border-white/5 bg-surface-dark">
                    <div class="relative group">
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div class="relative flex items-center bg-background-dark rounded-xl border border-white/10 shadow-lg">
                            <button class="p-3 text-slate-400 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined">mic</span>
                            </button>
                            <input class="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-sm py-3.5 px-2" placeholder="コマンドまたはCSVをドロップ..." type="text"/>
                            <button class="p-3 text-slate-400 hover:text-white transition-colors mr-1">
                                <span class="material-symbols-outlined text-[20px]">attach_file</span>
                            </button>
                            <button class="m-1 p-2 bg-primary hover:bg-primary-dark text-background-dark rounded-lg transition-colors shadow-lg shadow-primary/20">
                                <span class="material-symbols-outlined text-[20px]">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Schedule Grid Section -->
            <section class="flex-1 flex flex-col min-w-0 bg-background-dark relative overflow-hidden">
                <!-- Header Controls -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-dark/50 backdrop-blur-sm z-10">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3 pr-6 border-r border-white/10">
                            <div class="p-2 rounded-lg bg-surface-lighter border border-white/5">
                                <span class="material-symbols-outlined text-slate-400">calendar_month</span>
                            </div>
                            <div>
                                <h3 class="text-white text-sm font-bold">2023年11月</h3>
                                <p class="text-slate-500 text-xs">月次概要</p>
                            </div>
                        </div>
                        <div class="flex bg-surface-lighter/50 rounded-lg p-1 border border-white/5">
                            <button class="px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-bold shadow-sm transition-all">スタッフ別表示</button>
                            <button class="px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 text-xs font-medium transition-all">現場別表示</button>
                        </div>
                    </div>

                    <!-- Stats Cards -->
                    <div class="flex gap-4">
                        <div class="flex items-center gap-3 px-4 py-2 rounded-xl bg-warning/5 border border-warning/20">
                            <div class="flex flex-col">
                                <span class="text-[10px] text-warning/80 uppercase tracking-wider font-bold">平均配置比率</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-xl font-bold text-warning">7.6:1</span>
                                    <span class="material-symbols-outlined text-warning text-[18px]">warning</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 px-4 py-2 rounded-xl bg-violation/5 border border-violation/20">
                            <div class="flex flex-col">
                                <span class="text-[10px] text-violation/80 uppercase tracking-wider font-bold">未配置</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-xl font-bold text-violation">残り3名</span>
                                    <span class="material-symbols-outlined text-violation text-[18px]">error</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
                            <div class="flex flex-col items-end">
                                <span class="text-[10px] text-primary/80 uppercase tracking-wider font-bold">稼働率</span>
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[18px]">trending_up</span>
                                    <span class="text-xl font-bold text-primary">94%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Schedule Table -->
                <div class="flex-1 overflow-auto custom-scrollbar relative flex flex-col">
                    <table class="w-full border-collapse mb-auto">
                        <thead class="sticky top-0 z-10 bg-surface-dark shadow-md">
                            <tr>
                                <th class="sticky left-0 z-20 bg-surface-dark w-[240px] min-w-[240px] p-3 text-left border-b border-r border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider pl-6">
                                    氏名 / 所属
                                </th>
                                ${['月 01', '火 02', '水 03', '木 04', '金 05', '土 06', '日 07'].map((day, i) => `
                                    <th class="min-w-[120px] p-2 border-b border-r border-white/10 text-center ${i === 1 ? 'bg-white/5' : ''} ${i >= 5 ? 'bg-surface-lighter/30' : ''}">
                                        <div class="flex flex-col items-center">
                                            <span class="text-xs ${i === 1 ? 'text-primary' : i >= 5 ? 'text-violation/70' : 'text-slate-500'} uppercase">${day.split(' ')[0]}</span>
                                            <span class="text-sm ${i >= 5 ? 'text-slate-400' : 'text-white'} font-bold">${day.split(' ')[1]}</span>
                                        </div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <!-- Location Header -->
                            <tr class="bg-surface-lighter/20">
                                <td class="sticky left-0 z-10 bg-surface-lighter/90 backdrop-blur-sm border-b border-white/10 p-2 pl-6" colspan="8">
                                    <div class="flex items-center gap-2 text-primary font-bold">
                                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                                        北サイト (作業エリアB)
                                    </div>
                                </td>
                            </tr>

                            ${mockScheduleData.map(person => `
                                <tr class="group hover:bg-white/5 transition-colors">
                                    <td class="sticky left-0 z-10 bg-background-dark group-hover:bg-[#1a2026] border-b border-r border-white/5 p-3 pl-6 transition-colors">
                                        <div class="flex items-center gap-3">
                                            <div class="size-8 rounded-full bg-slate-700 bg-cover" style='background-image: url("${person.avatar}");'></div>
                                            <div>
                                                <div class="text-white font-medium flex items-center gap-2">
                                                    ${person.name}
                                                    <span class="bg-${person.type === 'staff' ? 'staff' : 'member'}-badge/20 text-${person.type === 'staff' ? 'staff' : 'member'}-badge text-[10px] px-1.5 py-0.5 rounded border border-${person.type === 'staff' ? 'staff' : 'member'}-badge/30 font-bold">${person.type === 'staff' ? '社員' : '利用者'}</span>
                                                </div>
                                                <div class="text-xs text-slate-500">${person.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    ${person.schedule.map((shift, i) => {
                                        if (!shift) {
                                            return '<td class="border-b border-r border-white/5 p-1 text-center"><span class="text-slate-600 text-xs">-</span></td>'
                                        }
                                        const bgClass = shift.highlight ? 'bg-primary/5' : shift.violation ? 'bg-violation/5' : ''
                                        const borderClass = shift.highlight ? 'border-primary shadow-[0_0_10px_rgba(43,238,121,0.2)]' : shift.violation ? 'border-violation' : 'border-white/10'
                                        return `
                                            <td class="border-b border-r border-white/5 p-1 relative ${bgClass}">
                                                <div class="bg-surface-lighter rounded-full h-full min-h-[56px] mx-1 p-2 flex flex-col justify-center border ${borderClass} cursor-grab hover:border-primary/50 transition-colors relative">
                                                    ${shift.violation ? '<div class="absolute top-0 right-0 p-1"><span class="material-symbols-outlined text-[12px] text-violation">error</span></div>' : ''}
                                                    <div class="flex items-center justify-between text-xs mb-0.5">
                                                        <span class="text-white font-bold">${shift.time}</span>
                                                        ${shift.highlight ? '<span class="size-1.5 rounded-full bg-primary animate-pulse"></span>' : ''}
                                                    </div>
                                                    <div class="flex items-center ${shift.highlight ? 'justify-between' : ''} gap-1">
                                                        ${shift.highlight 
                                                            ? `<div class="flex items-center gap-1 overflow-hidden">
                                                                <span class="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                                                                <span class="text-[10px] text-primary truncate">${shift.location}</span>
                                                               </div>` 
                                                            : `<span class="material-symbols-outlined text-[14px] ${shift.violation ? 'text-violation' : 'text-slate-400'}">meeting_room</span>
                                                               <span class="text-[10px] ${shift.violation ? 'text-violation font-bold' : 'text-slate-400'} truncate">${shift.location}</span>`
                                                        }
                                                        <span class="text-[10px] text-slate-400 ${shift.highlight ? 'flex items-center shrink-0' : 'ml-auto'}">
                                                            ${shift.transport}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        `
                                    }).join('')}
                                </tr>
                            `).join('')}

                            <!-- Unassigned Row -->
                            <tr class="group hover:bg-white/5 transition-colors">
                                <td class="sticky left-0 z-10 bg-background-dark group-hover:bg-[#1a2026] border-b border-r border-white/5 p-3 pl-6 transition-colors">
                                    <div class="flex items-center gap-3 opacity-60">
                                        <div class="size-8 rounded-full border border-dashed border-slate-500 flex items-center justify-center text-slate-500">
                                            <span class="material-symbols-outlined text-[18px]">person_add</span>
                                        </div>
                                        <div>
                                            <div class="text-slate-400 font-medium italic">未割り当て</div>
                                            <div class="text-xs text-slate-500">必須要件</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-b border-r border-white/5 p-1 text-center"><span class="text-slate-600 text-xs">-</span></td>
                                <td class="border-b border-r border-white/5 p-1 text-center"><span class="text-slate-600 text-xs">-</span></td>
                                <td class="border-b border-r border-white/5 p-1 relative bg-warning/5">
                                    <div class="bg-surface-lighter/50 border-dashed border border-warning rounded-full h-full min-h-[56px] mx-1 p-2 flex flex-col justify-center items-center cursor-grab hover:bg-warning/10 transition-colors">
                                        <span class="text-xs text-warning font-bold">必須</span>
                                        <span class="text-[10px] text-warning/70">12:00 - 18:00</span>
                                    </div>
                                </td>
                                <td class="border-b border-r border-white/5 p-1 text-center" colspan="4"><span class="text-slate-600 text-xs">-</span></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Daily Summary Footer -->
                    <div class="sticky bottom-0 z-30 bg-surface-dark border-t border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <table class="w-full">
                            <tbody>
                                <tr>
                                    <td class="w-[240px] min-w-[240px] p-3 pl-6 border-r border-white/10 text-xs font-bold text-slate-400">集計 (日次)</td>
                                    ${[
                                        { members: 12, staff: 2, ratio: 6.0, violation: true },
                                        { members: 16, staff: 2, ratio: 8.0, violation: true },
                                        { members: 14, staff: 2, ratio: 7.0, violation: true },
                                        { members: 15, staff: 2, ratio: 7.5 },
                                        { members: 13, staff: 2, ratio: 6.5, violation: true },
                                        { members: 0, staff: 0, ratio: 0 },
                                        { members: 0, staff: 0, ratio: 0 }
                                    ].map((day, i) => {
                                        if (day.members === 0) {
                                            return `<td class="min-w-[120px] p-2 border-r border-white/10 text-center bg-surface-lighter/30"><div class="text-[10px] text-slate-500 py-2">-</div></td>`
                                        }
                                        return `
                                            <td class="min-w-[120px] p-2 border-r border-white/10 text-center ${i === 1 ? 'bg-white/5' : ''}">
                                                <div class="flex flex-col gap-1 text-[10px] text-slate-400">
                                                    <div class="flex justify-between px-2"><span>利用者:</span> <span class="text-white font-bold">${day.members}</span></div>
                                                    <div class="flex justify-between px-2"><span>職員:</span> <span class="text-white font-bold">${day.staff}</span></div>
                                                    <div class="flex justify-between items-center px-2 py-1 mt-1 rounded ${day.violation ? 'bg-red-500/10' : ''}">
                                                        <span>比率:</span> 
                                                        <span class="${day.violation ? 'text-red-500' : 'text-primary'} font-bold ${day.violation && i === 1 ? 'flex items-center gap-1' : ''}">
                                                            ${day.ratio}${day.violation && i === 1 ? ' <span class="material-symbols-outlined text-[10px]">warning</span>' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        `
                                    }).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Edit Shift Modal (Bottom Right) -->
                <div class="absolute bottom-10 right-10 w-[300px] bg-surface-dark border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                    <div class="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                        <h4 class="text-white font-bold text-sm">シフト編集</h4>
                        <button class="text-slate-400 hover:text-white">
                            <span class="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="text-[10px] uppercase text-slate-500 font-bold mb-1 block">時間範囲</label>
                            <div class="flex items-center gap-2">
                                <input class="w-full bg-background-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary" type="text" value="09:00"/>
                                <span class="text-slate-500">-</span>
                                <input class="w-full bg-background-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary" type="text" value="17:00"/>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] uppercase text-slate-500 font-bold mb-1 block">場所</label>
                            <select class="w-full bg-background-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary">
                                <option>北サイト - メインホール</option>
                                <option>北サイト - 別館</option>
                                <option>南サイト</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] uppercase text-slate-500 font-bold mb-1 block">ステータス</label>
                            <div class="flex gap-2">
                                <button class="flex-1 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold border border-primary/20">確定済み</button>
                                <button class="flex-1 py-1.5 rounded-lg bg-background-dark text-slate-400 text-xs font-bold border border-white/10 hover:border-white/30">仮押さえ</button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-white/5 flex justify-end">
                        <button class="bg-white text-background-dark font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">変更を保存</button>
                    </div>
                </div>
            </section>
        </main>
    </body>
    </html>
  `)
})

// Staff management page (existing implementation)
app.get('/staff', (c) => {
  // Import existing staff management page code here
  const mockUsers = [
    {
      id: 'U012',
      name: '山田 太郎',
      nameKana: 'ヤマダ タロウ',
      nameEn: 'Yamada Taro',
      type: 'user',
      phone: '090-1234-5678',
      email: 'taro.yamada@example.com',
      address: '〒100-0001 東京都千代田区千代田1-1',
      joinDate: '2023年4月1日',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzZ4jKuE4eLOqGQFJTLWfSYvIQw6ga5-0DDm6Iqm1ShEx3hNIVYfkvRKBbUChAt9znM1fUKFwP6r0oHVGPATSAaC88UNDdv8tHGf3kWmKAo-LLkbtKGtfJtAN-ZJHVhphSQO_koHKMc0wdCYG_MGSg8axiwiomuxd2Noj5Assfi9cnYmZJA-C3bR8YX_LdkgIn_Ho5bqRB4ozcRsGzb88Ym7EHiUTErBDwqHAU6T8f3-SZW_TZ4IH3adqn80PxGd49_m-aNZVQ5aUM',
      workDays: [true, true, true, false, true, false, false],
      needsTransport: true,
      skills: [
        { name: '組立作業 (Assembly)', level: 4 },
        { name: '清掃 (Cleaning)', level: 2 },
        { name: 'PC入力 (Data Entry)', level: 3 }
      ],
      characteristics: ['立ち仕事NG', '聴覚過敏', '細かい作業が得意'],
      ngPairs: ['U013'],
      recommendedPairs: ['U014', 'U015']
    },
    {
      id: 'U013',
      name: '佐藤 花子',
      nameKana: 'サトウ ハナコ',
      nameEn: 'Sato Hanako',
      type: 'user',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbmhTjP-ZDNcokJMaMVFcQpuL20uIv4Zme8SIw4N8QHvYl79IDdXiL75Ep3ywT3A5RpCt7u4SIRWLOJouSadp8gcFPDxSAWfS_MCKxFP5JOxEWaLyiz0S1ovEQdC3Ycp9Fi-BXHhLwcNuAt-feHllUFHzvYgKfc2XeTEpXZU-C7GotIxhNk3HJgTsrTOQIjPNJK7eAUPEQIoWzEZQcKI9-hoQ10heqiF235k4ikDnB_yZwnrSk1Zo5ZQAuHGyWKV6ZPpzrjX3j-je'
    },
    {
      id: 'U014',
      name: '鈴木 一郎',
      nameKana: 'スズキ イチロウ',
      nameEn: 'Suzuki Ichiro',
      type: 'user',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDceCM8aWNGGOcIBZqRon_lsbwIlpHRSJjqKzOQrCSD2wlkpzgdAv5sKWUCrcdsZD-UmKY4GITD-3oe5ShzU6ANPaBw7wf8NP93h-msADgzvCHPmCxW_JTf6s2GqIUzxcwcxsssKzQc7E50VkcOy6mts2HVY73XW3n3rr0ss2K8-3iE-0Q6bg9NESvK33x_2Rg5y_FpnpIlAMwzCUNwG9pTOsIst_jffi24tYdB7UIgGbPz8l1Quf3UV2sJr_ZK_jl2392o6tVGhxrc'
    },
    {
      id: 'U015',
      name: '高橋 健太',
      nameKana: 'タカハシ ケンタ',
      nameEn: 'Takahashi Kenta',
      type: 'user',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUotUZdRPLwpcROP9o59SOnlNUFk6lgAqPwH64OIRVmSyha7vNkCTZ49gcdzBwbbgLQ7tEEAF8_x3nhlGPsji02f6TX_WXw5w3cFqY1yUK7otj7Jr670c-1J3Iw8_IbmjBWQSeA93pFjTc6O3isMyGDPUIfHkCBw6uPDl4pkeIL24M-De-MQU8WMfEQIK-FQ2zpnpviwtqJgmCAdmvgonY0t2p8PBQyl7N5s_DnwCF8M_L23EfqA06VVnFhVluXTPVQzVzyBqx2CqU'
    }
  ]

  const selectedUser = mockUsers[0]
  
  return c.html(`
    <!DOCTYPE html>
    <html class="dark" lang="ja">
    <head>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>Staff &amp; User Management - ShiftAI</title>
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script>
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#2bee79",
                            "primary-dark": "#1fa855",
                            "background-light": "#f6f8f7",
                            "background-dark": "#101418",
                            "surface-dark": "#1c232b",
                            "surface-lighter": "#2a343e",
                            "violation": "#fb4e6d",
                            "warning": "#fbbd23",
                            "member-badge": "#60a5fa",
                            "staff-badge": "#34d399",
                        },
                        fontFamily: {
                            "display": ["Spline Sans", "sans-serif"],
                            "body": ["Noto Sans JP", "Noto Sans", "sans-serif"]
                        },
                        borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                    },
                },
            }
        </script>
        <style>
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: #111814; }
            ::-webkit-scrollbar-thumb { background: #28392f; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #3b5445; }
            .filled-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        </style>
    </head>
    <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body h-screen flex flex-col overflow-hidden">
        <header class="flex items-center justify-between border-b border-white/5 bg-surface-dark px-6 py-3 shrink-0 z-20">
            <div class="flex items-center gap-4 text-white">
                <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                    <span class="material-symbols-outlined text-[28px]">smart_toy</span>
                </div>
                <div>
                    <h1 class="text-white text-lg font-bold leading-tight">AIシフトマネージャー</h1>
                    <p class="text-slate-400 text-xs font-medium">就労継続支援A型版 • v2.7</p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <nav class="hidden md:flex gap-1 bg-surface-lighter/50 p-1 rounded-full">
                    <a href="/" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">ダッシュボード</a>
                    <a href="/staff" class="px-4 py-1.5 rounded-full bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20">スタッフ管理</a>
                    <a href="/reports" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">実績報告</a>
                    <a href="/settings" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">設定</a>
                </nav>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex items-center gap-3">
                    <button class="flex items-center justify-center size-10 rounded-full bg-surface-lighter hover:bg-white/10 text-white transition-colors relative">
                        <span class="material-symbols-outlined text-[20px]">notifications</span>
                        <span class="absolute top-2 right-2.5 size-2 bg-violation rounded-full border border-surface-dark"></span>
                    </button>
                    <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-lighter" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-WSH1EuyyZnDvoTV0JfaeDXLoNOuD775YD06CTRVQImf7nWdzNOM5sDeReXDFUunR277CPcny0vMudsU5g2baEiJcMv97ZjQuF-pjsykzbJ3W5Dg5rJ7c359KrbKxW1xz-C-X8KV7-YZw2hFiwpGUGhevlVQxAcCaAvujjRgxvyBwhzR7FuRF8YzNWLaeXkj5e7uzZUg3_XC9CHZTvZGOV-2S_P0Wf4Q9YWxRrG3I05PALIsNbTfwl0uGcmpDYeWGTdk7faQ7GyJw");'></div>
                </div>
            </div>
        </header>
        <div class="flex flex-1 overflow-hidden">
            <aside class="w-80 flex flex-col border-r border-surface-border bg-[#161f1a]">
                <div class="p-4 flex flex-col gap-4 border-b border-surface-border">
                    <div class="relative w-full">
                        <input class="w-full h-10 bg-surface-dark border border-surface-border rounded-lg pl-10 pr-3 text-sm text-white focus:outline-none focus:border-primary placeholder:text-text-secondary" placeholder="名前やIDで検索..."/>
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[20px]">search</span>
                    </div>
                    <div class="flex bg-surface-dark p-1 rounded-lg border border-surface-border">
                        <label class="flex-1 cursor-pointer">
                            <input class="peer sr-only" name="list-filter" type="radio"/>
                            <div class="text-center text-xs font-medium py-1.5 rounded text-text-secondary peer-checked:bg-surface-border peer-checked:text-white transition-all">社員 (Staff)</div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input checked class="peer sr-only" name="list-filter" type="radio"/>
                            <div class="text-center text-xs font-medium py-1.5 rounded text-text-secondary peer-checked:bg-surface-border peer-checked:text-white transition-all">利用者 (User)</div>
                        </label>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto">
                    ${mockUsers.map((user, index) => `
                        <div class="p-3 border-l-4 ${index === 0 ? 'border-primary bg-surface-dark/50' : 'border-transparent hover:bg-surface-dark'} cursor-pointer transition-colors ${index > 0 ? 'border-b border-surface-border/30' : ''}">
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    <div class="size-10 rounded-full bg-cover bg-center ${index > 0 ? 'grayscale opacity-70' : ''}" style='background-image: url("${user.avatar}");'></div>
                                    ${index === 0 ? '<div class="absolute -bottom-0.5 -right-0.5 size-3 bg-primary rounded-full border-2 border-[#161f1a]"></div>' : ''}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm ${index === 0 ? 'font-bold text-white' : 'font-medium text-text-secondary'} truncate">${user.name}</p>
                                        <span class="text-[10px] ${index === 0 ? 'bg-primary/20 text-primary border-primary/20' : 'bg-surface-border text-text-secondary'} px-1.5 py-0.5 rounded border">${user.id}</span>
                                    </div>
                                    <p class="text-xs ${index === 0 ? 'text-text-secondary' : 'text-text-secondary/60'} truncate">${user.nameEn}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </aside>
            <main class="flex-1 flex flex-col overflow-hidden bg-background-dark relative">
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div class="px-8 pt-8 pb-4 shrink-0 z-10">
                    <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-6 border-b border-surface-border">
                        <div class="flex items-center gap-5">
                            <div class="size-24 rounded-full bg-cover bg-center ring-4 ring-surface-border shadow-lg" style='background-image: url("${selectedUser.avatar}");'></div>
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-3">
                                    <h1 class="text-3xl font-bold text-white">${selectedUser.name}</h1>
                                    <span class="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">利用者 (User)</span>
                                    <span class="px-2 py-0.5 rounded text-xs font-bold bg-surface-border text-text-secondary border border-surface-border">ID: ${selectedUser.id}</span>
                                </div>
                                <p class="text-text-secondary">${selectedUser.nameKana} (${selectedUser.nameEn})</p>
                                <div class="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                                    <span class="material-symbols-outlined text-[16px]">calendar_month</span>
                                    <span>入社日: ${selectedUser.joinDate}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button class="flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-surface-border hover:bg-surface-border text-white text-sm font-bold transition-colors">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                                編集
                            </button>
                            <button class="flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-bold transition-colors">
                                <span class="material-symbols-outlined text-[18px]">delete</span>
                                削除
                            </button>
                        </div>
                    </div>
                    <div class="flex gap-8 mt-4 border-b border-surface-border">
                        <button class="pb-3 text-sm font-bold text-primary border-b-2 border-primary">基本情報</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">スキル・特性</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">人間関係</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">活動履歴</button>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto px-8 pb-10">
                    <div class="max-w-4xl flex flex-col gap-6">
                        <section class="bg-surface-dark rounded-xl p-6 border border-surface-border shadow-sm">
                            <h3 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">badge</span>
                                基本情報・連絡先
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div class="flex flex-col gap-2">
                                    <label class="text-xs font-bold text-text-secondary uppercase">電話番号</label>
                                    <div class="flex items-center gap-3 text-white bg-background-dark p-3 rounded-lg border border-surface-border">
                                        <span class="material-symbols-outlined text-text-secondary">call</span>
                                        ${selectedUser.phone}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label class="text-xs font-bold text-text-secondary uppercase">メールアドレス</label>
                                    <div class="flex items-center gap-3 text-white bg-background-dark p-3 rounded-lg border border-surface-border">
                                        <span class="material-symbols-outlined text-text-secondary">mail</span>
                                        ${selectedUser.email}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 md:col-span-2">
                                    <label class="text-xs font-bold text-text-secondary uppercase">住所</label>
                                    <div class="flex items-center gap-3 text-white bg-background-dark p-3 rounded-lg border border-surface-border">
                                        <span class="material-symbols-outlined text-text-secondary">home</span>
                                        ${selectedUser.address}
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-surface-border/50">
                                <div class="flex flex-col gap-3">
                                    <label class="text-xs font-bold text-text-secondary uppercase">契約出勤日</label>
                                    <div class="flex gap-2 flex-wrap">
                                        ${['月', '火', '水', '木', '金', '土', '日'].map((day, i) => `
                                            <span class="size-9 flex items-center justify-center rounded-full text-xs font-bold ${selectedUser.workDays[i] ? 'bg-primary text-surface-dark' : 'bg-surface-border text-text-secondary opacity-50'} cursor-default">${day}</span>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <label class="text-xs font-bold text-text-secondary uppercase">送迎の必要性</label>
                                    <div class="flex items-center gap-4">
                                        <div class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${selectedUser.needsTransport ? 'bg-primary' : 'bg-surface-border'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                            <span class="pointer-events-none inline-block h-6 w-6 ${selectedUser.needsTransport ? 'translate-x-5' : 'translate-x-0'} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </div>
                                        <span class="text-sm font-bold text-white">${selectedUser.needsTransport ? '必要 (Required)' : '不要'}</span>
                                    </div>
                                    ${selectedUser.needsTransport ? '<p class="text-xs text-text-secondary">※ルートB (北口方面) を利用中</p>' : ''}
                                </div>
                            </div>
                        </section>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <section class="bg-surface-dark rounded-xl p-6 border border-surface-border shadow-sm flex flex-col gap-5">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                                        <span class="material-symbols-outlined text-primary">psychology</span>
                                        スキル・特性
                                    </h3>
                                    <button class="text-xs font-bold text-primary hover:text-white transition-colors">編集</button>
                                </div>
                                <div class="space-y-4">
                                    ${selectedUser.skills.map(skill => `
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm text-white font-medium">${skill.name}</span>
                                            <div class="flex text-primary">
                                                ${Array(5).fill(0).map((_, i) => `
                                                    <span class="material-symbols-outlined text-[20px] ${i < skill.level ? 'filled-icon' : 'text-surface-border'}">star</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="pt-4 border-t border-surface-border/50">
                                    <label class="text-xs font-bold text-text-secondary uppercase mb-3 block">特性タグ (Characteristics)</label>
                                    <div class="flex flex-wrap gap-2">
                                        ${selectedUser.characteristics.map((char, i) => {
                                            const colors = [
                                                'bg-red-500/10 text-red-400 border-red-500/20',
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                'bg-surface-border text-text-secondary'
                                            ]
                                            return `<span class="px-3 py-1 rounded-full ${colors[i] || colors[2]} border text-xs font-bold">${char}</span>`
                                        }).join('')}
                                        <button class="px-3 py-1 rounded-full border border-dashed border-text-secondary text-text-secondary hover:text-white hover:border-white text-xs font-bold flex items-center gap-1 transition-colors">
                                            <span class="material-symbols-outlined text-[14px]">add</span> 追加
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <section class="bg-surface-dark rounded-xl p-6 border border-surface-border shadow-sm flex flex-col gap-5">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                                        <span class="material-symbols-outlined text-primary">group</span>
                                        人間関係 (Pairs)
                                    </h3>
                                    <button class="size-8 rounded-full bg-surface-border hover:bg-primary hover:text-surface-dark text-white flex items-center justify-center transition-colors">
                                        <span class="material-symbols-outlined text-[20px]">add</span>
                                    </button>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="material-symbols-outlined text-red-400 text-[18px]">block</span>
                                        <span class="text-xs font-bold text-red-400 uppercase">NG ペア (Conflicts)</span>
                                    </div>
                                    <div class="space-y-2">
                                        ${selectedUser.ngPairs.map(userId => {
                                            const user = mockUsers.find(u => u.id === userId)
                                            return `
                                                <div class="flex items-center justify-between bg-background-dark p-2 rounded-lg border border-surface-border group">
                                                    <div class="flex items-center gap-3">
                                                        <div class="size-8 rounded-full bg-cover bg-center" style='background-image: url("${user.avatar}");'></div>
                                                        <span class="text-sm text-white">${user.name}</span>
                                                    </div>
                                                    <button class="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <span class="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            `
                                        }).join('')}
                                    </div>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="material-symbols-outlined text-primary text-[18px]">thumb_up</span>
                                        <span class="text-xs font-bold text-primary uppercase">推奨ペア (Recommended)</span>
                                    </div>
                                    <div class="space-y-2">
                                        ${selectedUser.recommendedPairs.map(userId => {
                                            const user = mockUsers.find(u => u.id === userId)
                                            return `
                                                <div class="flex items-center justify-between bg-background-dark p-2 rounded-lg border border-surface-border group">
                                                    <div class="flex items-center gap-3">
                                                        <div class="size-8 rounded-full bg-cover bg-center" style='background-image: url("${user.avatar}");'></div>
                                                        <span class="text-sm text-white">${user.name}</span>
                                                    </div>
                                                    <button class="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <span class="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            `
                                        }).join('')}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `)
})

// Reports page route
app.get('/reports', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html class="light" lang="ja">
    <head>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>実績報告画面 (Performance Report)</title>
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#2bee79",
                            "primary-dark": "#1fa855",
                            "background-light": "#f6f8f7",
                            "background-dark": "#101418",
                            "surface-dark": "#1c232b",
                            "surface-lighter": "#2a343e",
                            "violation": "#fb4e6d",
                            "warning": "#fbbd23",
                            "member-badge": "#60a5fa",
                            "staff-badge": "#34d399",
                        },
                        fontFamily: {
                            "display": ["Spline Sans", "sans-serif"],
                            "body": ["Noto Sans JP", "Noto Sans", "sans-serif"]
                        },
                        borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                    },
                },
            }
        </script>
        <style>
            body {
                font-family: "Spline Sans", "Noto Sans JP", sans-serif;
            }
            .donut-ring {
                transition: stroke-dashoffset 0.35s;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }
        </style>
    </head>
    <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body min-h-screen flex flex-col">
        <!-- Top Navigation -->
        <header class="flex items-center justify-between border-b border-white/5 bg-surface-dark px-6 py-3 shrink-0 z-20">
            <div class="flex items-center gap-4 text-white">
                <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                    <span class="material-symbols-outlined text-[28px]">smart_toy</span>
                </div>
                <div>
                    <h1 class="text-white text-lg font-bold leading-tight">AIシフトマネージャー</h1>
                    <p class="text-slate-400 text-xs font-medium">就労継続支援A型版 • v2.7</p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <nav class="hidden md:flex gap-1 bg-surface-lighter/50 p-1 rounded-full">
                    <a href="/" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">ダッシュボード</a>
                    <a href="/staff" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">スタッフ管理</a>
                    <a href="/reports" class="px-4 py-1.5 rounded-full bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20">実績報告</a>
                    <a href="/settings" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">設定</a>
                </nav>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex items-center gap-3">
                    <button class="flex items-center justify-center size-10 rounded-full bg-surface-lighter hover:bg-white/10 text-white transition-colors relative">
                        <span class="material-symbols-outlined text-[20px]">notifications</span>
                        <span class="absolute top-2 right-2.5 size-2 bg-violation rounded-full border border-surface-dark"></span>
                    </button>
                    <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-lighter" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-WSH1EuyyZnDvoTV0JfaeDXLoNOuD775YD06CTRVQImf7nWdzNOM5sDeReXDFUunR277CPcny0vMudsU5g2baEiJcMv97ZjQuF-pjsykzbJ3W5Dg5rJ7c359KrbKxW1xz-C-X8KV7-YZw2hFiwpGUGhevlVQxAcCaAvujjRgxvyBwhzR7FuRF8YzNWLaeXkj5e7uzZUg3_XC9CHZTvZGOV-2S_P0Wf4Q9YWxRrG3I05PALIsNbTfwl0uGcmpDYeWGTdk7faQ7GyJw");'></div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Heading & Controls -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div class="flex flex-col gap-1">
                    <h1 class="text-3xl md:text-4xl font-bold text-text-main dark:text-white tracking-tight">実績報告</h1>
                    <div class="flex items-center gap-2 text-text-secondary dark:text-gray-400 mt-1">
                        <span class="material-symbols-outlined text-[20px]">calendar_month</span>
                        <span class="text-lg font-medium">2023年 10月度</span>
                        <button class="text-sm text-primary font-bold hover:underline ml-2">変更</button>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button class="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-text-main font-bold shadow-sm shadow-primary/20">
                        <span class="material-symbols-outlined">download</span>
                        <span>一括ダウンロード</span>
                    </button>
                </div>
            </div>

            <!-- Summary Cards Section (KPIs) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <!-- Card 1: Operation Rate -->
                <div class="group bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 flex flex-col justify-between relative overflow-hidden">
                    <div class="flex justify-between items-start mb-4 z-10">
                        <div>
                            <p class="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider mb-1">稼働率</p>
                            <div class="flex items-baseline gap-2">
                                <span class="text-4xl font-bold text-text-main dark:text-white font-display">95%</span>
                                <span class="text-sm font-medium text-primary flex items-center">
                                    <span class="material-symbols-outlined text-[16px]">trending_up</span>
                                    +2.4%
                                </span>
                            </div>
                        </div>
                        <div class="size-10 rounded-full bg-background-light dark:bg-gray-800 flex items-center justify-center text-text-secondary">
                            <span class="material-symbols-outlined">donut_large</span>
                        </div>
                    </div>
                    <!-- Chart Visualization -->
                    <div class="flex items-center gap-6 mt-2">
                        <div class="relative size-24">
                            <svg class="size-full" height="100" viewbox="0 0 100 100" width="100">
                                <circle class="text-gray-100 dark:text-gray-700 stroke-current" cx="50" cy="50" fill="transparent" r="40" stroke-width="12"></circle>
                                <circle class="text-primary progress-ring__circle stroke-current donut-ring" cx="50" cy="50" fill="transparent" r="40" stroke-dasharray="251.2" stroke-dashoffset="12.56" stroke-linecap="round" stroke-width="12"></circle>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center flex-col">
                                <span class="text-xs font-bold text-text-secondary">目標</span>
                                <span class="text-xs font-bold text-text-main dark:text-white">100%</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 text-sm flex-1">
                            <div class="flex justify-between items-center">
                                <span class="text-text-secondary">実績</span>
                                <span class="font-bold">285時間</span>
                            </div>
                            <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div class="bg-primary h-1.5 rounded-full" style="width: 95%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Placement Ratio -->
                <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider">平均配置比率</p>
                        <div class="size-10 rounded-full bg-background-light dark:bg-gray-800 flex items-center justify-center text-text-secondary">
                            <span class="material-symbols-outlined">groups</span>
                        </div>
                    </div>
                    <div class="flex-1 flex items-center">
                        <span class="text-5xl font-bold text-text-main dark:text-white tracking-tighter font-display">8.2 : 1</span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <span class="material-symbols-outlined text-[14px]">check_circle</span>
                            基準達成
                        </span>
                        <span class="text-xs text-text-secondary">（基準 7.5:1）</span>
                    </div>
                </div>

                <!-- Card 3: Unfulfilled Days -->
                <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-700 flex flex-col justify-between border-l-4 border-l-primary">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wider">未充足日数</p>
                        <div class="size-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined">event_available</span>
                        </div>
                    </div>
                    <div class="flex-1 flex items-center gap-3">
                        <span class="text-5xl font-bold text-text-main dark:text-white font-display">0</span>
                        <span class="text-2xl font-bold text-text-secondary pb-1">日</span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p class="text-sm text-text-secondary">
                            減算対象となる未充足日はありません。<br/>
                            <span class="font-bold text-primary">正常な状態です。</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Reports List Section -->
            <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 class="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">description</span>
                        帳票一覧 (Reports)
                    </h2>
                    <div class="flex gap-2">
                        <button aria-label="List view" class="p-2 text-text-secondary hover:text-text-main transition-colors">
                            <span class="material-symbols-outlined">view_list</span>
                        </button>
                        <button aria-label="Grid view" class="p-2 text-primary bg-primary/10 rounded transition-colors">
                            <span class="material-symbols-outlined">grid_view</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Report Card 1 -->
                    <div class="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                <span class="material-symbols-outlined text-[28px]">assignment_ind</span>
                            </div>
                            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 rounded">月次</span>
                        </div>
                        <h3 class="text-lg font-bold text-text-main dark:text-white mb-2">サービス提供実績記録票</h3>
                        <p class="text-sm text-text-secondary dark:text-gray-400 mb-6 flex-1">
                            利用者ごとのサービス提供実績を記録した月次帳票です。国保連請求の根拠資料となります。
                        </p>
                        <div class="flex gap-3 mt-auto">
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded border border-gray-200 dark:border-gray-600 text-sm font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">visibility</span>
                                プレビュー
                            </button>
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded bg-text-main dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">file_download</span>
                                DL
                            </button>
                        </div>
                    </div>

                    <!-- Report Card 2 -->
                    <div class="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                                <span class="material-symbols-outlined text-[28px]">edit_note</span>
                            </div>
                            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 rounded">日次</span>
                        </div>
                        <h3 class="text-lg font-bold text-text-main dark:text-white mb-2">業務日報</h3>
                        <p class="text-sm text-text-secondary dark:text-gray-400 mb-6 flex-1">
                            スタッフの業務内容、申し送り事項を記録した日報です。監査時に提示が必要です。
                        </p>
                        <div class="flex gap-3 mt-auto">
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded border border-gray-200 dark:border-gray-600 text-sm font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">visibility</span>
                                プレビュー
                            </button>
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded bg-text-main dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">file_download</span>
                                DL
                            </button>
                        </div>
                    </div>

                    <!-- Report Card 3 -->
                    <div class="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                <span class="material-symbols-outlined text-[28px]">local_shipping</span>
                            </div>
                            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 rounded">随時</span>
                        </div>
                        <h3 class="text-lg font-bold text-text-main dark:text-white mb-2">送迎運行記録</h3>
                        <p class="text-sm text-text-secondary dark:text-gray-400 mb-6 flex-1">
                            送迎車両ごとの運行時間、乗車利用者、ドライバーを記録した運行記録簿です。
                        </p>
                        <div class="flex gap-3 mt-auto">
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded border border-gray-200 dark:border-gray-600 text-sm font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">visibility</span>
                                プレビュー
                            </button>
                            <button class="flex-1 h-10 flex items-center justify-center gap-2 rounded bg-text-main dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                <span class="material-symbols-outlined text-[18px]">file_download</span>
                                DL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="mt-auto border-t border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark py-6">
            <div class="max-w-[1280px] mx-auto px-4 text-center text-xs text-text-secondary dark:text-gray-500">
                © 2023 ShiftMgr AI. All rights reserved. Type A Business Establishment Management System.
            </div>
        </footer>
    </body>
    </html>
  `)
})

// Settings page route
app.get('/settings', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html class="light" lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>設定画面 - ShiftAI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap');
            * { font-family: 'Spline Sans', 'Noto Sans JP', sans-serif; }
        </style>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <script>
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#2bee79",
                            "primary-dark": "#1fa855",
                            "background-light": "#f6f8f7",
                            "background-dark": "#101418",
                            "surface-dark": "#1c232b",
                            "surface-lighter": "#2a343e",
                            "violation": "#fb4e6d",
                            "warning": "#fbbd23",
                            "member-badge": "#60a5fa",
                            "staff-badge": "#34d399",
                        },
                        fontFamily: {
                            "display": ["Spline Sans", "sans-serif"],
                            "body": ["Noto Sans JP", "Noto Sans", "sans-serif"]
                        },
                        borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                    },
                },
            }
        </script>
    </head>
    <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body min-h-screen flex flex-col">
        <!-- Header -->
        <header class="flex items-center justify-between border-b border-white/5 bg-surface-dark px-6 py-3 shrink-0 z-20">
            <div class="flex items-center gap-4 text-white">
                <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                    <span class="material-symbols-outlined text-[28px]">smart_toy</span>
                </div>
                <div>
                    <h1 class="text-white text-lg font-bold leading-tight">AIシフトマネージャー</h1>
                    <p class="text-slate-400 text-xs font-medium">就労継続支援A型版 • v2.7</p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <nav class="hidden md:flex gap-1 bg-surface-lighter/50 p-1 rounded-full">
                    <a href="/" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">ダッシュボード</a>
                    <a href="/staff" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">スタッフ管理</a>
                    <a href="/reports" class="px-4 py-1.5 rounded-full text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">実績報告</a>
                    <a href="/settings" class="px-4 py-1.5 rounded-full bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20">設定</a>
                </nav>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex items-center gap-3">
                    <button class="flex items-center justify-center size-10 rounded-full bg-surface-lighter hover:bg-white/10 text-white transition-colors relative">
                        <span class="material-symbols-outlined text-[20px]">notifications</span>
                        <span class="absolute top-2 right-2.5 size-2 bg-violation rounded-full border border-surface-dark"></span>
                    </button>
                    <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-lighter" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-WSH1EuyyZnDvoTV0JfaeDXLoNOuD775YD06CTRVQImf7nWdzNOM5sDeReXDFUunR277CPcny0vMudsU5g2baEiJcMv97ZjQuF-pjsykzbJ3W5Dg5rJ7c359KrbKxW1xz-C-X8KV7-YZw2hFiwpGUGhevlVQxAcCaAvujjRgxvyBwhzR7FuRF8YzNWLaeXkj5e7uzZUg3_XC9CHZTvZGOV-2S_P0Wf4Q9YWxRrG3I05PALIsNbTfwl0uGcmpDYeWGTdk7faQ7GyJw");'></div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto p-8 space-y-8 pb-32">
            <!-- Site Master Settings -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-1">サイトマスタ設定</h2>
                        <p class="text-sm text-gray-600">作業所や事業所の基本情報を管理します (20件)</p>
                    </div>
                    <button class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 font-medium">
                        <span class="material-symbols-outlined text-xl">add</span>
                        新規追加
                    </button>
                </div>

                <!-- Site List -->
                <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    <!-- Site 1 -->
                    <div class="border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition bg-gray-50/50">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <input type="text" value="第一作業所" class="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 -ml-2 w-full">
                                <p class="text-sm text-gray-500 mt-1 px-2">ID: SITE-001</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="text-gray-700 font-medium">職員常駐</span>
                                </label>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">最小職員数</label>
                                <input type="number" value="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">推奨職員数</label>
                                <input type="number" value="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-2">必須スキル</label>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    送迎可能
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    看護師
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <button class="px-3 py-1 border border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-primary hover:text-primary transition">
                                    + スキル追加
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Site 2 -->
                    <div class="border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition bg-gray-50/50">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <input type="text" value="品川配送センター" class="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 -ml-2 w-full">
                                <p class="text-sm text-gray-500 mt-1 px-2">ID: SITE-002</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-2 text-sm">
                                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="text-gray-700 font-medium">職員常駐</span>
                                </label>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">最小職員数</label>
                                <input type="number" value="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">推奨職員数</label>
                                <input type="number" value="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-2">必須スキル</label>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    ドライバー
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    フォークリフト
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <button class="px-3 py-1 border border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-primary hover:text-primary transition">
                                    + スキル追加
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Site 3 -->
                    <div class="border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition bg-gray-50/50">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <input type="text" value="第二作業所" class="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 -ml-2 w-full">
                                <p class="text-sm text-gray-500 mt-1 px-2">ID: SITE-003</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="text-gray-700 font-medium">職員常駐</span>
                                </label>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">最小職員数</label>
                                <input type="number" value="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">推奨職員数</label>
                                <input type="number" value="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-2">必須スキル</label>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    送迎可能
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                                    調理師
                                    <span class="material-symbols-outlined text-base cursor-pointer hover:text-red-500">close</span>
                                </span>
                                <button class="px-3 py-1 border border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-primary hover:text-primary transition">
                                    + スキル追加
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- App Rules Settings -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-1">アプリルール設定</h2>
                    <p class="text-sm text-gray-600">システム全体のルールとアラート条件を設定します</p>
                </div>

                <div class="space-y-6">
                    <!-- Placement Standard -->
                    <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                        <label class="block text-sm font-semibold text-gray-900 mb-3">配置基準値</label>
                        <div class="flex items-center gap-3">
                            <input type="number" step="0.1" value="7.5" class="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium text-lg">
                            <span class="text-gray-600">時間/日</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">※ 利用者1人あたりに必要な職員の配置時間</p>
                    </div>

                    <!-- Consecutive Work Alert -->
                    <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                        <label class="block text-sm font-semibold text-gray-900 mb-3">連続勤務アラート</label>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <span class="text-sm text-gray-700 min-w-[180px]">最大連続勤務日数</span>
                                <input type="number" value="5" class="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium">
                                <span class="text-gray-600">日</span>
                            </div>
                            <p class="text-xs text-gray-500">※ 設定日数を超えると警告を表示します</p>
                        </div>
                    </div>

                    <!-- Other Rules (Placeholder) -->
                    <div class="border border-dashed border-gray-300 rounded-xl p-5 text-center">
                        <button class="text-primary hover:text-primary/80 font-medium flex items-center gap-2 mx-auto">
                            <span class="material-symbols-outlined">add_circle</span>
                            新しいルールを追加
                        </button>
                    </div>
                </div>
            </section>
        </main>

        <!-- Floating Action Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div class="max-w-7xl mx-auto px-8 py-4 flex items-center justify-end gap-4">
                <button class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                    キャンセル
                </button>
                <button class="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl">save</span>
                    変更を保存
                </button>
            </div>
        </div>
    </body>
    </html>
  `)
})

export default app
