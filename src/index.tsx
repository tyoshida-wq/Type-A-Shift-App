import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from public/static directory
app.use('/static/*', serveStatic({ root: './public' }))

// Mock user data
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

// Main page route
app.get('/', (c) => {
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
        <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        colors: {
                            "primary": "#2bee79",
                            "background-light": "#f6f8f7",
                            "background-dark": "#111814",
                            "surface-dark": "#1c2720",
                            "surface-border": "#28392f",
                            "text-secondary": "#9db9a8",
                        },
                        fontFamily: {
                            "display": ["Spline Sans", "Noto Sans JP", "sans-serif"],
                            "body": ["Spline Sans", "Noto Sans JP", "sans-serif"],
                        },
                        borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                    },
                },
            }
        </script>
        <style>
            /* Custom scrollbar for dark theme */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #111814;
            }
            ::-webkit-scrollbar-thumb {
                background: #28392f;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #3b5445;
            }
            .filled-icon {
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
        </style>
    </head>
    <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-hidden h-screen flex flex-col">
        <!-- Top Navigation -->
        <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-border px-6 py-3 bg-surface-dark shrink-0">
            <div class="flex items-center gap-4 text-white">
                <div class="size-8 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined filled-icon" style="font-size: 32px;">auto_awesome</span>
                </div>
                <h2 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">ShiftAI Manager</h2>
            </div>
            <div class="flex flex-1 justify-end gap-6 items-center">
                <div class="flex gap-3">
                    <button class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-surface-border hover:bg-[#3b5445] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        <span class="material-symbols-outlined mr-2 text-[18px]">upload</span>
                        <span class="truncate">CSVインポート</span>
                    </button>
                    <button class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-[#22c563] text-[#111814] text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-[0_0_10px_rgba(43,238,121,0.2)]">
                        <span class="material-symbols-outlined mr-2 text-[18px]">download</span>
                        <span class="truncate">エクスポート</span>
                    </button>
                </div>
                <div class="h-6 w-px bg-surface-border"></div>
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <div class="text-sm font-bold text-white">管理者</div>
                        <div class="text-xs text-text-secondary">Admin User</div>
                    </div>
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-surface-border" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2dYQK4X5NIhdl1TMfrjITWMUu-sZ68PbXvujPy31ehCZ6Qbprlk5mRu1wfE2XVWpw_CGw6_OlyUX1sjlVr-DrAckpUfHHz98S7QMj2x0d14O2lX2Zaeo5TkRKK1YuMJJ9UQCyTz9hiv0Wo0rq3akC3DsJd07mvKCeAvUeku7laP-eFQA3KrVUhm5u9VlqavnLdIEsBy6C51Do8y72Xkga0r5-AkvbLf-0a9egdAWvwEVu-P89lP2Wp6dyn9eci5fNgQWHd5BdBL6x");'></div>
                </div>
            </div>
        </header>

        <!-- Main Content Layout -->
        <div class="flex flex-1 overflow-hidden">
            <!-- Left Sidebar: List View -->
            <aside class="w-80 flex flex-col border-r border-surface-border bg-[#161f1a]">
                <!-- Sidebar Header / Search -->
                <div class="p-4 flex flex-col gap-4 border-b border-surface-border">
                    <div class="relative w-full">
                        <input class="w-full h-10 bg-surface-dark border border-surface-border rounded-lg pl-10 pr-3 text-sm text-white focus:outline-none focus:border-primary placeholder:text-text-secondary" placeholder="名前やIDで検索..."/>
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[20px]">search</span>
                    </div>
                    <!-- Segmented Control -->
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

                <!-- List Content -->
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

            <!-- Right Panel: Detailed Profile -->
            <main class="flex-1 flex flex-col overflow-hidden bg-background-dark relative">
                <!-- Background Decoration -->
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                <!-- Profile Header Card -->
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

                    <!-- Tabs Navigation -->
                    <div class="flex gap-8 mt-4 border-b border-surface-border">
                        <button class="pb-3 text-sm font-bold text-primary border-b-2 border-primary">基本情報</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">スキル・特性</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">人間関係</button>
                        <button class="pb-3 text-sm font-bold text-text-secondary hover:text-white transition-colors">活動履歴</button>
                    </div>
                </div>

                <!-- Scrollable Content Area -->
                <div class="flex-1 overflow-y-auto px-8 pb-10">
                    <div class="max-w-4xl flex flex-col gap-6">
                        <!-- Section: Basic Info -->
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
                                <!-- Contract Days -->
                                <div class="flex flex-col gap-3">
                                    <label class="text-xs font-bold text-text-secondary uppercase">契約出勤日</label>
                                    <div class="flex gap-2 flex-wrap">
                                        ${['月', '火', '水', '木', '金', '土', '日'].map((day, i) => `
                                            <span class="size-9 flex items-center justify-center rounded-full text-xs font-bold ${selectedUser.workDays[i] ? 'bg-primary text-surface-dark' : 'bg-surface-border text-text-secondary opacity-50'} cursor-default">${day}</span>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- Transportation Toggle -->
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
                            <!-- Section: Skills & Characteristics -->
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

                            <!-- Section: Relationships -->
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

                                <!-- NG Pairs -->
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

                                <!-- Recommended Pairs -->
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

export default app
