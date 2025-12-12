-- ユーザー/スタッフのシードデータ
INSERT OR IGNORE INTO users (id, name, name_kana, name_en, type, phone, email, address, join_date, avatar, work_days, needs_transport) VALUES
  ('U012', '山田 太郎', 'ヤマダ タロウ', 'Yamada Taro', 'user', '090-1234-5678', 'taro.yamada@example.com', '〒100-0001 東京都千代田区千代田1-1', '2023年4月1日', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzZ4jKuE4eLOqGQFJTLWfSYvIQw6ga5-0DDm6Iqm1ShEx3hNIVYfkvRKBbUChAt9znM1fUKFwP6r0oHVGPATSAaC88UNDdv8tHGf3kWmKAo-LLkbtKGtfJtAN-ZJHVhphSQO_koHKMc0wdCYG_MGSg8axiwiomuxd2Noj5Assfi9cnYmZJA-C3bR8YX_LdkgIn_Ho5bqRB4ozcRsGzb88Ym7EHiUTErBDwqHAU6T8f3-SZW_TZ4IH3adqn80PxGd49_m-aNZVQ5aUM', '[true, true, true, false, true, false, false]', 1),
  ('U013', '佐藤 花子', 'サトウ ハナコ', 'Sato Hanako', 'user', '090-2345-6789', 'hanako.sato@example.com', '〒150-0001 東京都渋谷区渋谷2-2', '2023年5月10日', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbmhTjP-ZDNcokJMaMVFcQpuL20uIv4Zme8SIw4N8QHvYl79IDdXiL75Ep3ywT3A5RpCt7u4SIRWLOJouSadp8gcFPDxSAWfS_MCKxFP5JOxEWaLyiz0S1ovEQdC3Ycp9Fi-BXHhLwcNuAt-feHllUFHzvYgKfc2XeTEpXZU-C7GotIxhNk3HJgTsrTOQIjPNJK7eAUPEQIoWzEZQcKI9-hoQ10heqiF235k4ikDnB_yZwnrSk1Zo5ZQAuHGyWKV6ZPpzrjX3j-je', '[true, true, false, true, true, false, false]', 0),
  ('U014', '鈴木 一郎', 'スズキ イチロウ', 'Suzuki Ichiro', 'user', '090-3456-7890', 'ichiro.suzuki@example.com', '〒104-0061 東京都中央区銀座3-3', '2023年6月15日', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDceCM8aWNGGOcIBZqRon_lsbwIlpHRSJjqKzOQrCSD2wlkpzgdAv5sKWUCrcdsZD-UmKY4GITD-3oe5ShzU6ANPaBw7wf8NP93h-msADgzvCHPmCxW_JTf6s2GqIUzxcwcxsssKzQc7E50VkcOy6mts2HVY73XW3n3rr0ss2K8-3iE-0Q6bg9NESvK33x_2Rg5y_FpnpIlAMwzCUNwG9pTOsIst_jffi24tYdB7UIgGbPz8l1Quf3UV2sJr_ZK_jl2392o6tVGhxrc', '[false, true, true, true, true, false, false]', 1),
  ('U015', '高橋 健太', 'タカハシ ケンタ', 'Takahashi Kenta', 'user', '090-4567-8901', 'kenta.takahashi@example.com', '〒160-0022 東京都新宿区新宿4-4', '2023年7月20日', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUotUZdRPLwpcROP9o59SOnlNUFk6lgAqPwH64OIRVmSyha7vNkCTZ49gcdzBwbbgLQ7tEEAF8_x3nhlGPsji02f6TX_WXw5w3cFqY1yUK7otj7Jr670c-1J3Iw8_IbmjBWQSeA93pFjTc6O3isMyGDPUIfHkCBw6uPDl4pkeIL24M-De-MQU8WMfEQIK-FQ2zpnpviwtqJgmCAdmvgonY0t2p8PBQyl7N5s_DnwCF8M_L23EfqA06VVnFhVluXTPVQzVzyBqx2CqU', '[true, true, true, true, false, false, false]', 0),
  ('S001', 'サラ・ジェンキンス', 'サラ・ジェンキンス', 'Sarah Jenkins', 'staff', '090-1111-2222', 'sarah.jenkins@example.com', '〒105-0001 東京都港区虎ノ門1-1', '2020年4月1日', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqhSH4PvKxjtOwHWBF5ga3Nz2kGXpxV50O4zrxk3svVEX5g44iRzvpQ4zsalM2ln92Vs2ZDDputXiPSzfg7Bb5oBQcBa6UdJ83hX-pA4jzeR49wlbia248Cokgt9QNWsIXEKB1aQTeZSECvAReIjKQBnah0gtHPWe8iOhnF52QaluoE0snPgZcnCbh1pFJU1yGJfzhPKa0DmQIiGuZ_jsMxu13_jbjiE9of1YlTEmom2BSJIO7p5XDcHpkKdt3ob9B6dWhymOdqEr4', '[true, true, true, true, true, false, false]', 0);

-- スキルデータ
INSERT OR IGNORE INTO skills (user_id, name, level) VALUES
  ('U012', '組立作業 (Assembly)', 4),
  ('U012', '清掃 (Cleaning)', 2),
  ('U012', 'PC入力 (Data Entry)', 3),
  ('U013', '清掃 (Cleaning)', 5),
  ('U013', '調理補助 (Cooking)', 3),
  ('U014', 'PC入力 (Data Entry)', 4),
  ('U014', '組立作業 (Assembly)', 3),
  ('U015', '清掃 (Cleaning)', 4),
  ('U015', '梱包作業 (Packing)', 5);

-- 特性タグ
INSERT OR IGNORE INTO characteristics (user_id, tag) VALUES
  ('U012', '立ち仕事NG'),
  ('U012', '聴覚過敏'),
  ('U012', '細かい作業が得意'),
  ('U013', '体力に自信あり'),
  ('U013', '人と話すのが好き'),
  ('U014', '集中力が高い'),
  ('U014', 'PC操作が得意'),
  ('U015', '几帳面な性格'),
  ('U015', 'チームワーク重視');

-- 人間関係
INSERT OR IGNORE INTO relationships (user_id, related_user_id, type) VALUES
  ('U012', 'U013', 'ng'),
  ('U012', 'U014', 'recommended'),
  ('U012', 'U015', 'recommended'),
  ('U013', 'U012', 'ng'),
  ('U014', 'U012', 'recommended');

-- サイトマスタ
INSERT OR IGNORE INTO sites (id, name, min_staff, recommended_staff, staff_always_present) VALUES
  ('SITE-001', '第一作業所', 2, 3, 1),
  ('SITE-002', '品川配送センター', 1, 2, 0),
  ('SITE-003', '第二作業所', 3, 4, 1);

-- サイト必須スキル
INSERT OR IGNORE INTO site_required_skills (site_id, skill_name) VALUES
  ('SITE-001', '送迎可能'),
  ('SITE-001', '看護師'),
  ('SITE-002', 'ドライバー'),
  ('SITE-002', 'フォークリフト'),
  ('SITE-003', '送迎可能'),
  ('SITE-003', '調理師');

-- アプリルール設定
INSERT OR IGNORE INTO app_rules (rule_key, rule_value, rule_type, description) VALUES
  ('placement_standard', '7.5', 'number', '配置基準値（時間/日）'),
  ('max_consecutive_days', '5', 'number', '最大連続勤務日数（日）');

-- シフトサンプルデータ
INSERT OR IGNORE INTO shifts (user_id, date, start_time, end_time, location, transport, status, is_support, is_violation) VALUES
  ('S001', '2023-11-01', '09:00', '17:00', '面談室A', 'A便', 'confirmed', 0, 0),
  ('S001', '2023-11-02', '09:00', '17:00', '応援配置', '社1', 'confirmed', 1, 0),
  ('S001', '2023-11-04', '13:00', '21:00', '別館B', '自力', 'confirmed', 0, 0),
  ('U012', '2023-11-02', '10:00', '15:00', '通院予定', '送迎', 'tentative', 0, 1),
  ('U012', '2023-11-03', '10:00', '15:00', '清掃作業', 'B便', 'confirmed', 0, 0),
  ('U013', '2023-11-01', '10:00', '15:00', '箱詰め', '徒歩', 'confirmed', 0, 0),
  ('U013', '2023-11-02', '10:00', '15:00', '箱詰め', '徒歩', 'confirmed', 0, 0),
  ('U013', '2023-11-03', '10:00', '15:00', '箱詰め', '徒歩', 'confirmed', 0, 0);
