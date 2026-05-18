(function () {
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('stockflow-dark', isDark);
        document.body.classList.toggle('stockflow-dark', isDark);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

        const toggle = document.getElementById('stockflowThemeToggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.title = isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え';
            toggle.innerHTML = isDark
                ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 12 3Z"></path></svg>';
        }
    }

    function getInitialTheme() {
        const saved = localStorage.getItem('stockflow-theme');
        return saved === 'dark' ? 'dark' : 'light';
    }

    function ensureThemeToggle() {
        if (document.getElementById('stockflowThemeToggle')) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.id = 'stockflowThemeToggle';
        toggle.className = 'stockflow-theme-toggle';
        toggle.setAttribute('aria-label', 'テーマ切替');
        toggle.addEventListener('click', function () {
            const nextTheme = document.documentElement.classList.contains('stockflow-dark') ? 'light' : 'dark';
            localStorage.setItem('stockflow-theme', nextTheme);
            applyTheme(nextTheme);
        });

        const headerActions = document.querySelector('header .shrink-0.flex.items-center.gap-3');
        if (headerActions) {
            headerActions.insertBefore(toggle, headerActions.firstChild);
        } else {
            document.body.appendChild(toggle);
        }
        applyTheme(getInitialTheme());
    }

    function normalizeSidebarForRole() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            return;
        }

        const roleText = Array.from(sidebar.querySelectorAll('span'))
            .map(function (span) { return span.textContent.trim(); })
            .find(function (text) { return text === 'ADMIN' || text === 'USER'; });
        const pageText = [
            document.title,
            document.querySelector('main h1')?.textContent || '',
            document.querySelector('main h2')?.textContent || '',
            sidebar.textContent || ''
        ].join(' ');
        const isAdmin = roleText === 'ADMIN' || pageText.includes('管理者') || pageText.includes('admin@test.com');
        const links = Array.from(sidebar.querySelectorAll('nav a'));
        const brandLink = sidebar.querySelector(':scope > div:first-child a[href="/dashboard"]');
        if (brandLink) {
            brandLink.setAttribute('href', isAdmin ? '/dashboard' : '/mypage');
        }

        links.forEach(function (link) {
            const label = link.querySelector('span');
            const href = link.getAttribute('href') || '';
            if (!label) {
                return;
            }

            let visible = true;
            if (href === '/dashboard') {
                visible = isAdmin;
                label.textContent = '管理者ダッシュボード';
            } else if (href === '/mypage') {
                visible = !isAdmin;
                label.textContent = '利用者ダッシュボード';
            } else if (href === '/rentals' || href === '/rentals-employee') {
                visible = href === (isAdmin ? '/rentals' : '/rentals-employee');
                label.textContent = '貸出一覧';
                link.setAttribute('href', isAdmin ? '/rentals' : '/rentals-employee');
            } else if (href === '/reservations' || href === '/reservations-employee') {
                visible = href === (isAdmin ? '/reservations' : '/reservations-employee');
                label.textContent = '予約一覧';
                link.setAttribute('href', '/reservations');
            } else if (href === '/requests' || href === '/requests-employee') {
                visible = href === (isAdmin ? '/requests' : '/requests-employee');
                label.textContent = '要望一覧';
                link.setAttribute('href', '/requests');
            } else if (href === '/equipments' || href === '/employees' || href === '/settings') {
                visible = isAdmin;
                if (href === '/equipments') {
                    label.textContent = '備品管理';
                }
            }

            link.classList.toggle('hidden', !visible);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            ensureThemeToggle();
            normalizeSidebarForRole();
        });
    } else {
        ensureThemeToggle();
        normalizeSidebarForRole();
    }

    function ensureGenericModal() {
        let modal = document.getElementById('stockflowGenericModal');
        if (modal) {
            return modal;
        }

        modal = document.createElement('div');
        modal.id = 'stockflowGenericModal';
        modal.className = 'fixed inset-0 z-[120] hidden flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" data-modal-close></div>
            <div id="stockflowGenericModalContent" class="relative w-full max-w-lg max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden scale-95 opacity-0 transition-all duration-200 flex flex-col">
                <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <p id="stockflowGenericModalEyebrow" class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Stockflow</p>
                        <h3 id="stockflowGenericModalTitle" class="text-lg font-black text-slate-900 tracking-tight">確認</h3>
                    </div>
                    <button type="button" data-modal-close class="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="px-6 py-5 overflow-y-auto custom-scrollbar">
                    <p id="stockflowGenericModalMessage" class="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line"></p>
                    <div id="stockflowGenericModalMeta" class="mt-4 space-y-2"></div>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" data-modal-close class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">閉じる</button>
                    <a id="stockflowGenericModalLink" href="#" class="hidden px-4 py-2 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors">詳細を見る</a>
                    <button type="button" id="stockflowGenericModalAction" class="hidden px-4 py-2 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors">確定</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function (event) {
            if (event.target.closest('[data-modal-close]')) {
                closeGenericModal();
            }
        });
        return modal;
    }

    function showExistingModal(id) {
        const modal = document.getElementById(id);
        if (!modal) {
            return false;
        }

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        requestAnimationFrame(function () {
            const content = document.getElementById(id + 'Content');
            const backdrop = document.getElementById(id + 'Backdrop');
            if (content) {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }
            if (backdrop) {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
            }
        });
        return true;
    }

    function closeExistingModal(id) {
        const modal = document.getElementById(id);
        if (!modal) {
            return false;
        }

        const content = document.getElementById(id + 'Content');
        const backdrop = document.getElementById(id + 'Backdrop');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        if (backdrop) {
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
        }

        setTimeout(function () {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }, 160);
        return true;
    }

    function metaRow(label, value) {
        if (value === undefined || value === null || value === '') {
            return '';
        }
        return `
            <div class="flex items-center justify-between gap-4 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">${escapeHtml(label)}</span>
                <span class="text-sm font-bold text-slate-800 text-right">${escapeHtml(String(value))}</span>
            </div>
        `;
    }

    function formField(label, type, placeholder, value) {
        return `
            <label class="block">
                <span class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">${escapeHtml(label)}</span>
                <input type="${escapeHtml(type || 'text')}" value="${escapeHtml(value || '')}" placeholder="${escapeHtml(placeholder || '')}" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            </label>
        `;
    }

    function inputField(id, label, type, placeholder, value, required, readonly) {
        return `
            <label class="block">
                <span class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">${escapeHtml(label)}${required ? '<span class="text-rose-500 ml-1">*</span>' : ''}</span>
                <input id="${escapeHtml(id)}" type="${escapeHtml(type || 'text')}" value="${escapeHtml(value || '')}" placeholder="${escapeHtml(placeholder || '')}" ${readonly ? 'readonly' : ''} class="w-full rounded-xl border border-slate-200 ${readonly ? 'bg-slate-100 text-slate-500' : 'bg-white text-slate-700'} px-4 py-3 text-sm font-bold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            </label>
        `;
    }

    function selectField(id, label, options, value, required) {
        return `
            <label class="block">
                <span class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">${escapeHtml(label)}${required ? '<span class="text-rose-500 ml-1">*</span>' : ''}</span>
                <select id="${escapeHtml(id)}" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
                    ${options.map(function (option) {
                        return `<option value="${escapeHtml(option)}" ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>`;
                    }).join('')}
                </select>
            </label>
        `;
    }

    function textAreaField(id, label, placeholder, value, required) {
        return `
            <label class="block">
                <span class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">${escapeHtml(label)}${required ? '<span class="text-rose-500 ml-1">*</span>' : ''}</span>
                <textarea id="${escapeHtml(id)}" rows="3" placeholder="${escapeHtml(placeholder || '')}" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 resize-none">${escapeHtml(value || '')}</textarea>
            </label>
        `;
    }

    function dateTimeField(id, label, value, required) {
        return `
            <label class="block">
                <span class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">${escapeHtml(label)}${required ? '<span class="text-rose-500 ml-1">*</span>' : ''}</span>
                <input id="${escapeHtml(id)}" type="text" inputmode="numeric" value="${escapeHtml((value || '').replace('T', ' '))}" placeholder="YYYY-MM-DD HH:mm" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            </label>
        `;
    }

    function notifyCheckbox(id) {
        return `
            <label class="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs font-bold text-slate-600">
                <input id="${escapeHtml(id)}" type="checkbox" class="rounded border-slate-300 text-sky-600 focus:ring-sky-500">
                利用者へ通知する
            </label>
        `;
    }

    function modalError(id) {
        return `<p id="${escapeHtml(id)}" class="hidden text-[12px] font-bold text-rose-600"></p>`;
    }

    function escapeHtml(value) {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function formatRentalStatus(status, fallback) {
        const rawStatus = String(status || fallback || '').trim();
        if (!rawStatus) {
            return '貸出中';
        }
        const compactStatus = rawStatus.replace(/\s+/g, '');
        if (compactStatus.includes('延滞')) {
            const match = compactStatus.match(/(\d+)日/);
            return match ? `${match[1]}日延滞中` : '延滞中';
        }
        return compactStatus;
    }

    function openGenericModal(options) {
        const modal = ensureGenericModal();
        const eyebrow = document.getElementById('stockflowGenericModalEyebrow');
        if (options.eyebrow === '') {
            eyebrow.textContent = '';
            eyebrow.classList.add('hidden');
        } else {
            eyebrow.textContent = options.eyebrow || 'Stockflow';
            eyebrow.classList.remove('hidden');
        }
        document.getElementById('stockflowGenericModalTitle').textContent = options.title || '確認';
        const message = document.getElementById('stockflowGenericModalMessage');
        if (options.message) {
            message.textContent = options.message;
            message.classList.remove('hidden');
        } else {
            message.textContent = '';
            message.classList.add('hidden');
        }
        document.getElementById('stockflowGenericModalMeta').innerHTML = (options.meta || [])
            .map(function (item) {
                return metaRow(item[0], item[1]);
            })
            .join('');

        if (options.html) {
            document.getElementById('stockflowGenericModalMeta').insertAdjacentHTML('beforeend', options.html);
        }

        const link = document.getElementById('stockflowGenericModalLink');
        if (options.href && options.href !== '#') {
            link.href = options.href;
            link.textContent = options.linkText || '詳細を見る';
            link.classList.remove('hidden');
        } else {
            link.classList.add('hidden');
        }

        const action = document.getElementById('stockflowGenericModalAction');
        action.onclick = null;
        if (options.actionText && typeof options.onAction === 'function') {
            action.textContent = options.actionText;
            action.onclick = options.onAction;
            action.classList.remove('hidden');
        } else {
            action.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        requestAnimationFrame(function () {
            document.getElementById('stockflowGenericModalContent').classList.remove('scale-95', 'opacity-0');
            document.getElementById('stockflowGenericModalContent').classList.add('scale-100', 'opacity-100');
        });
    }

    function closeGenericModal() {
        const modal = document.getElementById('stockflowGenericModal');
        if (!modal) {
            return;
        }
        const content = document.getElementById('stockflowGenericModalContent');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(function () {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }, 160);
    }

    window.closeGenericModal = closeGenericModal;

    window.openDetailModal = function (type, title, name, status, startDate, endDate, detailUrl, body, options) {
        if (arguments.length === 0 && showExistingModal('detailModal')) {
            return;
        }

        if (type === 'rental') {
            const rentalOptions = options || {};
            const rentalStatus = formatRentalStatus(rentalOptions.rentalStatus, status);
            openGenericModal({
                eyebrow: '',
                title: '延滞情報',
                href: detailUrl,
                linkText: '貸出詳細を見る',
                meta: [
                    ['備品名', title],
                    ['管理番号', rentalOptions.managementNo || '未設定'],
                    ['利用者', name],
                    ['所属', rentalOptions.department || '未設定'],
                    ['貸出日時', startDate],
                    ['返却予定日時', endDate],
                    ['貸出状態', rentalStatus]
                ]
            });
            return;
        }

        if (type === 'request') {
            const requestOptions = options || {};
            openGenericModal({
                eyebrow: '',
                title: '要望情報',
                href: detailUrl,
                linkText: '要望詳細を見る',
                meta: [
                    ['要望件名', title],
                    ['要望種別', requestOptions.requestType || '備品追加'],
                    ['申請者', name],
                    ['所属', requestOptions.department || '未設定'],
                    ['承認状態', requestOptions.approvalStatus || status],
                    ['対応状態', requestOptions.processStatus || (status === '対応中' ? '対応中' : '未対応')],
                    ['申請日時', startDate],
                    ['希望期限', endDate]
                ]
            });
            return;
        }

        if (type === 'activity') {
            const activity = options || {};
            const activityType = activity.activityType || 'RENTAL_CREATED';
            const targetName = activity.targetName || title;

            const configs = {
                RESERVATION_CREATED: {
                    title: '予約情報',
                    statusLabel: '予約状態',
                    status: activity.status || '予約受付',
                    userLabel: '利用者',
                    targetLabel: '備品名',
                    dateRows: [
                        ['管理番号', activity.managementNo || '未設定'],
                        ['所属', activity.department || '未設定'],
                        ['利用開始日時', activity.useStartDate || startDate],
                        ['利用終了日時', activity.useEndDate || endDate],
                        ['予約数量', activity.quantity || '1'],
                        ['登録日時', activity.registeredAt || activity.processedAt || startDate]
                    ],
                    detailButton: '予約詳細を見る'
                },
                RENTAL_CREATED: {
                    title: '貸出情報',
                    statusLabel: '貸出状態',
                    status: activity.status || '貸出中',
                    userLabel: '利用者',
                    targetLabel: '備品名',
                    dateRows: [
                        ['管理番号', activity.managementNo || '未設定'],
                        ['所属', activity.department || '未設定'],
                        ['貸出日時', activity.rentalDate || startDate],
                        ['返却予定日時', activity.dueDate || endDate],
                        ['貸出数量', activity.quantity || '1'],
                        ['処理日時', activity.processedAt || startDate]
                    ],
                    detailButton: '貸出詳細を見る'
                },
                RETURN_COMPLETED: {
                    title: '返却情報',
                    statusLabel: '処理状態',
                    status: activity.status || '返却済',
                    userLabel: '利用者',
                    targetLabel: '備品名',
                    dateRows: [
                        ['管理番号', activity.managementNo || '未設定'],
                        ['所属', activity.department || '未設定'],
                        ['貸出日時', activity.rentalDate || startDate],
                        ['返却予定日時', activity.dueDate || endDate],
                        ['実返却日時', activity.actualReturnDate || activity.processedAt || startDate],
                        ['返却数量', activity.quantity || '1'],
                        ['処理日時', activity.processedAt || startDate]
                    ],
                    detailButton: '貸出詳細を見る'
                },
                REQUEST_CREATED: {
                    title: '要望情報',
                    statusLabel: '承認状態',
                    status: activity.approvalStatus || '申請中',
                    userLabel: '申請者',
                    dateRows: [
                        ['要望件名', targetName],
                        ['要望種別', activity.requestType || '新規購入'],
                        ['所属', activity.department || '未設定'],
                        ['対応状態', activity.processStatus || '未対応'],
                        ['申請日時', activity.requestDate || startDate],
                        ['希望期限', activity.desiredDueDate || endDate]
                    ],
                    detailButton: '要望詳細を見る'
                },
                ITEM_CREATED: {
                    title: '備品情報',
                    statusLabel: '備品状態',
                    status: activity.status || '登録完了',
                    userLabel: '登録者',
                    dateRows: [
                        ['備品名', targetName],
                        ['管理番号', activity.managementNo || '未設定'],
                        ['カテゴリ', activity.category || '未設定'],
                        ['保管場所', activity.location || '未設定'],
                        ['登録数量', activity.quantity || '1'],
                        ['登録日時', activity.registeredAt || activity.processedAt || startDate]
                    ],
                    detailButton: '備品詳細を見る'
                },
                STOCK_UPDATED: {
                    title: 'CSV取込情報',
                    statusLabel: '処理結果',
                    status: activity.status || '取込完了',
                    userLabel: null,
                    dateRows: [
                        ['ファイル名', targetName],
                        ['処理種別', activity.processType || '在庫更新'],
                        ['対象件数', activity.totalCount || '未設定'],
                        ['成功件数', activity.successCount || '未設定'],
                        ['失敗件数', activity.failureCount || '未設定'],
                        ['取込日時', activity.processedAt || startDate]
                    ],
                    detailButton: '取込結果を見る'
                }
            };

            const config = configs[activityType] || configs.RENTAL_CREATED;
            let meta;
            if (activityType === 'RESERVATION_CREATED') {
                meta = [
                    ['備品名', targetName],
                    ['管理番号', activity.managementNo || '未設定'],
                    ['利用者', activity.userName || status || '未設定'],
                    ['所属', activity.department || '未設定'],
                    ['利用開始日時', activity.useStartDate || startDate],
                    ['利用終了日時', activity.useEndDate || endDate],
                    ['予約数量', activity.quantity || '1'],
                    ['予約状態', config.status],
                    ['登録日時', activity.registeredAt || activity.processedAt || startDate]
                ];
            } else if (activityType === 'RENTAL_CREATED') {
                meta = [
                    ['備品名', targetName],
                    ['管理番号', activity.managementNo || '未設定'],
                    ['利用者', activity.userName || status || '未設定'],
                    ['所属', activity.department || '未設定'],
                    ['貸出日時', activity.rentalDate || startDate],
                    ['返却予定日時', activity.dueDate || endDate],
                    ['貸出数量', activity.quantity || '1'],
                    ['貸出状態', config.status],
                    ['処理日時', activity.processedAt || startDate]
                ];
            } else if (activityType === 'RETURN_COMPLETED') {
                meta = [
                    ['備品名', targetName],
                    ['管理番号', activity.managementNo || '未設定'],
                    ['利用者', activity.userName || status || '未設定'],
                    ['所属', activity.department || '未設定'],
                    ['貸出日時', activity.rentalDate || startDate],
                    ['返却予定日時', activity.dueDate || endDate],
                    ['実返却日時', activity.actualReturnDate || activity.processedAt || startDate],
                    ['返却数量', activity.quantity || '1'],
                    ['処理状態', config.status],
                    ['処理日時', activity.processedAt || startDate]
                ];
            } else if (activityType === 'REQUEST_CREATED') {
                meta = [
                    ['要望件名', targetName],
                    ['要望種別', activity.requestType || '新規購入'],
                    ['申請者', activity.userName || status || '未設定'],
                    ['所属', activity.department || '未設定'],
                    ['承認状態', config.status],
                    ['対応状態', activity.processStatus || '未対応'],
                    ['申請日時', activity.requestDate || startDate],
                    ['希望期限', activity.desiredDueDate || endDate]
                ];
            } else if (activityType === 'ITEM_CREATED') {
                meta = [
                    ['備品名', targetName],
                    ['管理番号', activity.managementNo || '未設定'],
                    ['カテゴリ', activity.category || '未設定'],
                    ['保管場所', activity.location || '未設定'],
                    ['登録数量', activity.quantity || '1'],
                    ['備品状態', config.status],
                    ['登録者', activity.userName || status || '未設定'],
                    ['登録日時', activity.registeredAt || activity.processedAt || startDate]
                ];
            } else if (activityType === 'STOCK_UPDATED') {
                meta = [
                    ['ファイル名', targetName],
                    ['処理種別', activity.processType || '在庫更新'],
                    ['対象件数', activity.totalCount || '未設定'],
                    ['成功件数', activity.successCount || '未設定'],
                    ['失敗件数', activity.failureCount || '未設定'],
                    ['処理結果', config.status],
                    ['取込日時', activity.processedAt || startDate]
                ];
            } else {
                meta = [
                    ['備品名', targetName],
                    [config.statusLabel, config.status],
                    [config.userLabel || '担当者', activity.userName || status || '未設定']
                ];
            }

            openGenericModal({
                eyebrow: '',
                title: config.title,
                href: detailUrl,
                linkText: config.detailButton,
                meta: meta
            });
            return;
        }

        openGenericModal({
            eyebrow: type || 'Detail',
            title: title || '詳細',
            message: body || '選択した項目の詳細です。',
            href: detailUrl,
            meta: [
                ['名前', name],
                ['状態', status],
                ['開始日', startDate],
                ['終了日', endDate]
            ]
        });
    };

    window.closeDetailModal = function () {
        if (!closeExistingModal('detailModal')) {
            closeGenericModal();
        }
    };

    function getRentalProcessData(rentalId, overrides) {
        const rentals = {
            'R-260401': {
                rentalId: 'R-260401',
                itemName: 'MacBook Pro 14インチ',
                managementNo: 'EQ-2026-001',
                userName: '黒崎 苺',
                department: '営業部',
                rentalDateTime: '2026-04-01 09:00',
                dueDateTime: '2026-04-10 18:00',
                quantity: '1',
                rentalStatus: '3日延滞中',
                nextReservation: 'あり',
                extendable: '不可'
            },
            'R-260405': {
                rentalId: 'R-260405',
                itemName: 'プロジェクター EPSON EH-TW',
                managementNo: 'EQ-2026-002',
                userName: '山田 太郎',
                department: '営業部',
                rentalDateTime: '2026-04-12 10:00',
                dueDateTime: '2026-04-14 18:00',
                quantity: '1',
                rentalStatus: '貸出中',
                nextReservation: 'なし',
                extendable: '可能'
            },
            'R-260408': {
                rentalId: 'R-260408',
                itemName: '会議用ホワイトボードマーカーセット',
                managementNo: 'EQ-2026-008',
                userName: '山田 花子',
                department: '総務部',
                rentalDateTime: '2026-04-13 14:00',
                dueDateTime: '2026-04-20 18:00',
                quantity: '5',
                rentalStatus: '貸出中',
                nextReservation: 'なし',
                extendable: '可能'
            }
        };
        return Object.assign({
            rentalId: rentalId,
            itemName: overrides?.itemName || '未設定',
            managementNo: '未設定',
            userName: '未設定',
            department: '営業部',
            rentalDateTime: '未設定',
            dueDateTime: overrides?.currentEndDate || '未設定',
            quantity: overrides?.quantity || '1',
            rentalStatus: '貸出中',
            nextReservation: 'なし',
            extendable: '可能'
        }, rentals[rentalId] || {}, overrides || {});
    }

    function setProcessError(message) {
        const error = document.getElementById('stockflowProcessError');
        if (!error) {
            return;
        }
        error.textContent = message;
        error.classList.remove('hidden');
    }

    function toDateTimeDisplay(value) {
        return String(value || '').trim().replace('T', ' ');
    }

    function isDateTimeText(value) {
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(String(value || '').trim());
    }

    function formatCurrentDateTime() {
        const now = new Date();
        const pad = function (value) { return String(value).padStart(2, '0'); };
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    function showProcessCompleteModal(title, meta) {
        openGenericModal({
            eyebrow: '',
            title: title,
            meta: meta
        });
    }

    function confirmProcess(message, onConfirm) {
        openGenericModal({
            eyebrow: '',
            title: '確認',
            message: message,
            actionText: '確定',
            onAction: onConfirm
        });
    }

    function getEmployeeData(name, email, role, status) {
        const employees = {
            '黒崎 苺': {
                employeeNo: 'EMP-0001',
                lastName: '黒崎',
                firstName: '苺',
                email: 'abcde12@weavus.com',
                department: 'IT部',
                phone: '010-1111-2222',
                role: 'ADMIN',
                status: '在職',
                gender: '未設定',
                birthday: '1992-04-15'
            },
            '山田 太郎': {
                employeeNo: 'EMP-0002',
                lastName: '山田',
                firstName: '太郎',
                email: 'yamada.taro@weavus.com',
                department: '営業部',
                phone: '03-1234-5678',
                role: 'USER',
                status: '退職',
                gender: '男性',
                birthday: '1988-09-10'
            }
        };
        return Object.assign({
            employeeNo: '',
            lastName: name ? String(name).split(' ')[0] : '山田',
            firstName: name ? String(name).split(' ')[1] || '' : '太郎',
            email: email || 'user@example.com',
            department: '未設定',
            phone: '',
            role: role || 'USER',
            status: status || '在職',
            gender: '',
            birthday: ''
        }, employees[name] || {});
    }

    function showEmployeeComplete(title, meta) {
        showProcessCompleteModal(title, meta.concat([['処理日時', formatCurrentDateTime()]]));
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
    }

    function isValidPassword(value) {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || ''));
    }

    function isEmployeeEmailDuplicate(email) {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        return ['abcde12@weavus.com', 'yamada.taro@weavus.com'].includes(normalizedEmail);
    }

    function getReservationProcessData(reservationId, userName) {
        const reservations = {
            'B-260501': {
                reservationId: 'B-260501',
                itemName: 'MacBook Pro 16インチ',
                managementNo: 'EQ-2026-010',
                userName: '鈴木 一郎',
                department: '営業部',
                useStartDateTime: '2026-04-20 09:00',
                useEndDateTime: '2026-04-25 18:00',
                quantity: '1',
                reservationStatus: '予約中'
            },
            'B-260492': {
                reservationId: 'B-260492',
                itemName: 'プロジェクター EPSON EH-TW',
                managementNo: 'EQ-2026-011',
                userName: '山田 太郎',
                department: '営業部',
                useStartDateTime: '2026-04-12 09:00',
                useEndDateTime: '2026-04-15 18:00',
                quantity: '1',
                reservationStatus: '予約中（遅延）'
            }
        };
        return Object.assign({
            reservationId: reservationId || 'B-000000',
            itemName: '未設定',
            managementNo: '未設定',
            userName: userName || '未設定',
            department: '未設定',
            useStartDateTime: '未設定',
            useEndDateTime: '未設定',
            quantity: '1',
            reservationStatus: '予約中'
        }, reservations[reservationId] || {});
    }

    window.openReturnModal = function (rentalId, itemName, quantity) {
        const rental = getRentalProcessData(rentalId, { itemName: itemName, quantity: String(quantity || '1') });
        openGenericModal({
            eyebrow: '',
            title: '返却処理',
            meta: [
                ['貸出ID', rental.rentalId],
                ['備品名', rental.itemName],
                ['管理番号', rental.managementNo],
                ['利用者', rental.userName],
                ['所属', rental.department],
                ['貸出日時', rental.rentalDateTime],
                ['返却予定日時', rental.dueDateTime],
                ['返却数量', rental.quantity],
                ['貸出状態', rental.rentalStatus]
            ],
            html: `
                <div class="mt-5 space-y-4">
                    ${textAreaField('stockflowReturnReason', '返却理由', '返却理由を入力してください', '', true)}
                    ${notifyCheckbox('stockflowReturnNotify')}
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '返却を確定',
            onAction: function () {
                const reason = document.getElementById('stockflowReturnReason')?.value.trim();
                const notify = document.getElementById('stockflowReturnNotify')?.checked;
                if (!reason) {
                    setProcessError('返却理由を入力してください。');
                    return;
                }
                confirmProcess('返却処理を確定します。よろしいですか？', function () {
                    showProcessCompleteModal('返却処理完了', [
                        ['処理種類', '返却処理'],
                        ['貸出ID', rental.rentalId],
                        ['備品ID', rental.managementNo],
                        ['利用者', rental.userName],
                        ['処理前状態', rental.rentalStatus],
                        ['処理後状態', '返却済'],
                        ['返却理由', reason],
                        ['通知メッセージ', notify ? reason : 'なし'],
                        ['通知', notify ? '作成する' : '作成しない'],
                        ['処理日時', formatCurrentDateTime()]
                    ]);
                });
            }
        });
    };

    window.openExtendModal = function (rentalId, currentEndDate) {
        const rental = getRentalProcessData(rentalId, { currentEndDate: currentEndDate });
        openGenericModal({
            eyebrow: '',
            title: '延長処理',
            meta: [
                ['貸出ID', rental.rentalId],
                ['備品名', rental.itemName],
                ['管理番号', rental.managementNo],
                ['利用者', rental.userName],
                ['所属', rental.department],
                ['貸出日時', rental.rentalDateTime],
                ['現在の返却予定日時', rental.dueDateTime],
                ['後続予約', rental.nextReservation],
                ['延長可否', rental.extendable],
                ['貸出状態', rental.rentalStatus]
            ],
            html: `
                <div class="mt-5 space-y-4">
                    ${dateTimeField('stockflowNewDueDateTime', '新しい返却予定日時', '', true)}
                    ${textAreaField('stockflowExtendReason', '延長理由', '延長理由を入力してください', '', true)}
                    ${textAreaField('stockflowExtendMessage', '利用者へのメッセージ', '利用者へ通知するメッセージを入力してください', '返却予定日時を変更しました。新しい返却予定日時をご確認ください。', false)}
                    ${notifyCheckbox('stockflowExtendNotify')}
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '延長を確定',
            onAction: function () {
                const nextDueDateTime = toDateTimeDisplay(document.getElementById('stockflowNewDueDateTime')?.value);
                const reason = document.getElementById('stockflowExtendReason')?.value.trim();
                const message = document.getElementById('stockflowExtendMessage')?.value.trim();
                const notify = document.getElementById('stockflowExtendNotify')?.checked;
                if (!nextDueDateTime) {
                    setProcessError('新しい返却予定日時を入力してください。');
                    return;
                }
                if (!isDateTimeText(nextDueDateTime)) {
                    setProcessError('新しい返却予定日時は YYYY-MM-DD HH:mm 形式で入力してください。');
                    return;
                }
                if (new Date(nextDueDateTime.replace(' ', 'T')) <= new Date(rental.dueDateTime.replace(' ', 'T'))) {
                    setProcessError('現在の返却予定日時より後の日時を指定してください。');
                    return;
                }
                if (new Date(nextDueDateTime.replace(' ', 'T')) < new Date()) {
                    setProcessError('過去の日時は指定できません。');
                    return;
                }
                if (rental.nextReservation !== 'なし') {
                    setProcessError('後続予約が存在するため、この日時までは延長できません。');
                    return;
                }
                if (!reason) {
                    setProcessError('延長理由を入力してください。');
                    return;
                }
                confirmProcess('延長処理を確定します。よろしいですか？', function () {
                    showProcessCompleteModal('延長処理完了', [
                        ['処理種類', '延長処理'],
                        ['貸出ID', rental.rentalId],
                        ['備品ID', rental.managementNo],
                        ['利用者', rental.userName],
                        ['処理前返却予定日時', rental.dueDateTime],
                        ['処理後返却予定日時', nextDueDateTime],
                        ['処理前状態', rental.rentalStatus],
                        ['処理後状態', rental.rentalStatus],
                        ['延長理由', reason],
                        ['メッセージ', message || 'なし'],
                        ['通知', notify ? '作成する' : '作成しない'],
                        ['処理日時', formatCurrentDateTime()]
                    ]);
                });
            }
        });
    };

    window.openCancelModal = function (reservationId, userName) {
        if (showExistingModal('cancelModal')) {
            return;
        }
        const reservation = getReservationProcessData(reservationId, userName);
        openGenericModal({
            eyebrow: '',
            title: '予約取消',
            meta: [
                ['予約ID', reservation.reservationId],
                ['備品名', reservation.itemName],
                ['管理番号', reservation.managementNo],
                ['予約者', reservation.userName],
                ['所属', reservation.department],
                ['利用開始日時', reservation.useStartDateTime],
                ['利用終了日時', reservation.useEndDateTime],
                ['予約数量', reservation.quantity],
                ['予約状態', reservation.reservationStatus]
            ],
            html: `
                <div class="mt-5 space-y-4">
                    ${textAreaField('stockflowReservationCancelMemo', '取消メモ', '取消理由を入力してください', '', true)}
                    ${notifyCheckbox('stockflowReservationCancelNotify')}
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '確認',
            onAction: function () {
                const memo = document.getElementById('stockflowReservationCancelMemo')?.value.trim();
                const notify = document.getElementById('stockflowReservationCancelNotify')?.checked;
                if (!memo) {
                    setProcessError('取消メモを入力してください。');
                    return;
                }
                confirmProcess('予約を取消します。よろしいですか？', function () {
                    showProcessCompleteModal('予約取消完了', [
                        ['処理種別', '予約取消'],
                        ['予約ID', reservation.reservationId],
                        ['備品ID', reservation.managementNo],
                        ['予約者', reservation.userName],
                        ['変更前状態', reservation.reservationStatus],
                        ['変更後状態', '取消済'],
                        ['取消メモ', memo],
                        ['利用者への通知本文', notify ? memo : 'なし'],
                        ['通知有無', notify ? 'あり' : 'なし'],
                        ['処理日時', formatCurrentDateTime()]
                    ]);
                });
            }
        });
    };

    window.openLendModal = function (reservationId) {
        openGenericModal({
            eyebrow: 'Lend',
            title: '貸出確認',
            message: '予約済み備品を貸出処理します。',
            meta: [['予約ID', reservationId]]
        });
    };

    window.openRejectModal = function (requestId) {
        openGenericModal({
            eyebrow: 'Reject',
            title: '却下確認',
            message: 'この申請を却下します。',
            meta: [['申請ID', requestId]]
        });
    };

    window.openBarcodeModal = function () {
        openGenericModal({
            eyebrow: 'Barcode',
            title: 'バーコード読み取り',
            message: '登録済みバーコードと備品番号を照合します。',
            html: formField('バーコード', 'text', 'SF-BC-2026-0001', '') + formField('照合メモ', 'text', '棚卸・返却・貸出時の照合結果', '')
        });
    };

    window.openCsvImportModal = function () {
        openGenericModal({
            eyebrow: 'CSV',
            title: 'CSVインポート',
            message: 'CSVファイルから備品情報を取り込みます。検証後に取込結果確認画面へ進みます。',
            href: '/csv-inventory',
            linkText: 'CSV在庫更新へ'
        });
    };

    window.openEquipmentModal = function (equipmentId) {
        openGenericModal({
            eyebrow: 'Equipment',
            title: '備品詳細',
            message: '選択した備品の詳細です。',
            meta: [['備品ID', equipmentId]],
            href: '/register-equipment'
        });
    };

    window.openRegisterModal = function () {
        openGenericModal({
            eyebrow: '',
            title: '利用者登録',
            html: `
                <div class="space-y-4">
                    ${inputField('employeeNo', '社員番号', 'text', 'EMP-0003', '', true)}
                    <div class="grid grid-cols-2 gap-3">
                        ${inputField('employeeLastName', '姓', 'text', '山田', '', true)}
                        ${inputField('employeeFirstName', '名', 'text', '太郎', '', true)}
                    </div>
                    ${inputField('employeeEmail', 'メールアドレス', 'email', 'user@example.com', '', true)}
                    <div class="grid grid-cols-2 gap-3">
                        ${inputField('employeePassword', '初期パスワード', 'password', '英数字8文字以上', '', true)}
                        ${inputField('employeePasswordConfirm', '初期パスワード確認', 'password', 'もう一度入力', '', true)}
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        ${selectField('employeeDepartment', '所属部署', ['営業部', 'IT部'], '営業部', false)}
                        ${inputField('employeePhone', '電話番号', 'text', '03-1234-5678', '', false)}
                    </div>
                    ${selectField('employeeGender', '性別', ['未設定', '男性', '女性', 'その他'], '未設定', false)}
                    <div class="grid grid-cols-2 gap-3">
                        ${selectField('employeeRole', '権限', ['USER', 'ADMIN'], 'USER', true)}
                        ${selectField('employeeStatus', '在籍状態', ['在職', '退職'], '在職', true)}
                    </div>
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '登録する',
            onAction: function () {
                const employeeNo = document.getElementById('employeeNo')?.value.trim();
                const lastName = document.getElementById('employeeLastName')?.value.trim();
                const firstName = document.getElementById('employeeFirstName')?.value.trim();
                const email = document.getElementById('employeeEmail')?.value.trim();
                const password = document.getElementById('employeePassword')?.value || '';
                const confirm = document.getElementById('employeePasswordConfirm')?.value || '';
                const department = document.getElementById('employeeDepartment')?.value;
                const gender = document.getElementById('employeeGender')?.value;
                const role = document.getElementById('employeeRole')?.value;
                const status = document.getElementById('employeeStatus')?.value;
                if (!employeeNo) return setProcessError('社員番号を入力してください。');
                if (!lastName) return setProcessError('姓は必須です。');
                if (!firstName) return setProcessError('名は必須です。');
                if (!email) return setProcessError('メールアドレスは必須です。');
                if (!isValidEmail(email)) return setProcessError('メールアドレス形式を確認してください。');
                if (isEmployeeEmailDuplicate(email)) return setProcessError('メールアドレスは既に登録されています。');
                if (!password) return setProcessError('初期パスワードは必須です。');
                if (!isValidPassword(password)) return setProcessError('初期パスワードは8文字以上、英字と数字を含めてください。');
                if (password !== confirm) return setProcessError('初期パスワード確認と一致しません。');
                if (!['営業部', 'IT部'].includes(department)) return setProcessError('所属部署を選択してください。');
                if (!['ADMIN', 'USER'].includes(role)) return setProcessError('権限は ADMIN / USER のみ設定できます。');
                if (!['在職', '退職'].includes(status)) return setProcessError('在籍状態を選択してください。');
                showEmployeeComplete('利用者登録完了', [
                    ['処理種類', '利用者登録'],
                    ['社員番号', employeeNo],
                    ['対象者', `${lastName} ${firstName}`],
                    ['メールアドレス', email],
                    ['所属部署', department],
                    ['性別', gender],
                    ['権限', role],
                    ['在籍状態', status],
                    ['初回パスワード変更', '要求する'],
                    ['操作履歴', '記録対象']
                ]);
            }
        });
    };

    window.openEditModal = function (name, email) {
        const employee = getEmployeeData(name, email);
        openGenericModal({
            eyebrow: '',
            title: '利用者情報編集',
            html: `
                <div class="space-y-4">
                    <div>
                        <p class="text-[11px] font-black text-slate-400 tracking-widest mb-3">基本情報</p>
                    </div>
                    ${inputField('editEmployeeNo', '社員番号', 'text', '', employee.employeeNo, false, true)}
                    <div class="grid grid-cols-2 gap-3">
                        ${inputField('editLastName', '姓', 'text', '姓', employee.lastName, true)}
                        ${inputField('editFirstName', '名', 'text', '名', employee.firstName, true)}
                    </div>
                    ${inputField('editEmail', 'メールアドレス', 'email', '', employee.email, false, true)}
                    <div class="grid grid-cols-2 gap-3">
                        ${selectField('editDepartment', '所属部署', ['営業部', 'IT部'], ['営業部', 'IT部'].includes(employee.department) ? employee.department : '営業部', false)}
                        ${inputField('editPhone', '電話番号', 'text', '電話番号', employee.phone, false)}
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        ${selectField('editGender', '性別', ['未設定', '男性', '女性', 'その他'], employee.gender || '未設定', false)}
                        ${inputField('editBirthday', '生年月日', 'date', '', employee.birthday, false)}
                    </div>
                    <div class="pt-2 border-t border-slate-100">
                        <p class="text-[11px] font-black text-slate-400 tracking-widest mb-3">権限・状態</p>
                        <div class="grid grid-cols-2 gap-3">
                            ${selectField('editRole', '権限', ['USER', 'ADMIN'], employee.role || 'USER', true)}
                            ${selectField('editStatus', '在籍状態', ['在職', '退職'], employee.status || '在職', true)}
                        </div>
                    </div>
                    <div class="pt-2 border-t border-slate-100">
                        <p class="text-[11px] font-black text-slate-400 tracking-widest mb-3">管理者PW変更</p>
                        <div class="grid grid-cols-2 gap-3">
                            ${inputField('editNewPassword', '新しいパスワード', 'password', '英数字8文字以上', '', false)}
                            ${inputField('editNewPasswordConfirm', '新しいパスワード確認', 'password', 'もう一度入力', '', false)}
                        </div>
                        <label class="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs font-bold text-slate-600">
                            <input id="editMustChangePassword" type="checkbox" checked class="rounded border-slate-300 text-sky-600 focus:ring-sky-500">
                            初回ログイン時にパスワード変更を要求する
                        </label>
                    </div>
                    ${textAreaField('editChangeReason', '変更理由', '変更理由を入力してください', '', true)}
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '保存する',
            onAction: function () {
                const lastName = document.getElementById('editLastName')?.value.trim();
                const firstName = document.getElementById('editFirstName')?.value.trim();
                const department = document.getElementById('editDepartment')?.value;
                const gender = document.getElementById('editGender')?.value || '未設定';
                const role = document.getElementById('editRole')?.value;
                const status = document.getElementById('editStatus')?.value;
                const password = document.getElementById('editNewPassword')?.value || '';
                const confirm = document.getElementById('editNewPasswordConfirm')?.value || '';
                const reason = document.getElementById('editChangeReason')?.value.trim();
                const mustChange = document.getElementById('editMustChangePassword')?.checked;
                if (!lastName) return setProcessError('姓を入力してください。');
                if (!firstName) return setProcessError('名を入力してください。');
                if (!['営業部', 'IT部'].includes(department)) return setProcessError('所属部署を選択してください。');
                if (!['ADMIN', 'USER'].includes(role)) return setProcessError('権限を選択してください。');
                if (!['在職', '退職'].includes(status)) return setProcessError('在籍状態を選択してください。');
                if (!password && confirm) return setProcessError('新しいパスワードを入力してください。');
                if (password && password.length < 8) return setProcessError('パスワードは8文字以上で入力してください。');
                if (password && (!/[A-Za-z]/.test(password) || !/\d/.test(password))) return setProcessError('パスワードは英字と数字を含めてください。');
                if (password && password !== confirm) return setProcessError('パスワード確認が一致しません。');
                if (!reason) return setProcessError('変更理由を入力してください。');
                const changedItems = [
                    employee.lastName !== lastName ? `姓: ${employee.lastName} → ${lastName}` : '',
                    employee.firstName !== firstName ? `名: ${employee.firstName} → ${firstName}` : '',
                    employee.department !== department ? `所属部署: ${employee.department} → ${department}` : '',
                    employee.phone !== (document.getElementById('editPhone')?.value || '') ? '電話番号' : '',
                    employee.gender !== gender ? `性別: ${employee.gender || '未設定'} → ${gender}` : '',
                    employee.birthday !== (document.getElementById('editBirthday')?.value || '') ? '生年月日' : '',
                    employee.role !== role ? `権限: ${employee.role} → ${role}` : '',
                    employee.status !== status ? `在籍状態: ${employee.status} → ${status}` : '',
                    password ? '管理者PW変更' : ''
                ].filter(Boolean);
                showEmployeeComplete('利用者情報保存完了', [
                    ['処理種類', '利用者情報編集'],
                    ['社員番号', employee.employeeNo],
                    ['対象者', `${lastName} ${firstName}`],
                    ['メールアドレス', employee.email],
                    ['所属部署', department],
                    ['性別', gender],
                    ['権限', role],
                    ['在籍状態', status],
                    ['PW変更', password ? '実行する' : '変更なし'],
                    ['初回パスワード変更', password ? (mustChange ? '要求する' : '要求しない') : '変更なし'],
                    ['変更項目', changedItems.length ? changedItems.join(' / ') : '入力内容確認'],
                    ['変更理由', reason],
                    ['操作履歴', '記録対象']
                ]);
            }
        });
    };

    window.openRequestModal = function () {
        openGenericModal({
            eyebrow: 'Request',
            title: '要望申請',
            message: '新しい備品要望を申請します。',
            html: formField('希望備品名', 'text', '27インチモニター', '') + formField('理由', 'text', '業務利用のため', '')
        });
    };

    window.openApplyModal = function (itemName, category, stock, imageUrl) {
        openGenericModal({
            eyebrow: 'Apply',
            title: '貸出申請',
            message: 'この備品の貸出申請を開始します。',
            meta: [
                ['備品', itemName],
                ['カテゴリ', category],
                ['在庫', stock],
                ['画像', imageUrl]
            ]
        });
    };

    window.openDuplicatePeriodErrorModal = function () {
        openGenericModal({
            eyebrow: '',
            title: '登録できません',
            message: '指定された期間には、同一備品の貸出または予約が既に存在します。'
        });
    };

    window.openReservationDuplicateErrorModal = function () {
        openGenericModal({
            eyebrow: '',
            title: '予約できません',
            message: '指定された期間には、同一備品の予約または貸出が既に存在します。'
        });
    };

    window.openPastReservationErrorModal = function () {
        openGenericModal({
            eyebrow: '',
            title: '予約できません',
            message: '過去日時を指定して予約することはできません。'
        });
    };

    window.openModal = function (id, reqId) {
        if (showExistingModal(id)) {
            const display = document.getElementById(id + 'IdDisplay') || document.getElementById('rejectModalIdDisplay');
            if (display && reqId) {
                display.textContent = reqId;
            }
            return;
        }
        openGenericModal({
            eyebrow: 'Modal',
            title: '確認',
            message: '選択した操作のポップアップです。',
            meta: [['ID', reqId]]
        });
    };

    window.closeModal = function (id) {
        if (!closeExistingModal(id)) {
            closeGenericModal();
        }
    };

    window.closeConfirmModal = function () {
        if (!closeExistingModal('confirmModal')) {
            closeGenericModal();
        }
    };

    window.confirmCancel = function (requestId) {
        openGenericModal({
            eyebrow: '',
            title: '取消確認',
            message: 'この申請を取消します。',
            meta: [['申請ID', requestId]]
        });
    };

    window.confirmCancelReturn = function (rentalId) {
        openGenericModal({
            eyebrow: '',
            title: '返却取消確認',
            message: 'この返却予定を取消します。',
            meta: [['貸出ID', rentalId]]
        });
    };

    window.confirmExpire = function (reservationId, userName) {
        openGenericModal({
            eyebrow: 'Expire',
            title: '失効処理確認',
            message: 'この予約を失効処理します。',
            meta: [
                ['予約ID', reservationId],
                ['利用者', userName]
            ]
        });
    };

    window.submitReturn = function () {
        openGenericModal({
            eyebrow: '',
            title: '返却処理',
            message: '返却処理を受け付けました。'
        });
    };

    window.saveExtend = function () {
        openGenericModal({
            eyebrow: '',
            title: '延長保存',
            message: '延長内容を保存しました。'
        });
    };

    window.saveChanges = function () {
        openGenericModal({
            eyebrow: 'Save',
            title: '変更保存',
            message: '変更内容を保存しました。'
        });
    };

    window.submitLend = function () {
        openGenericModal({
            eyebrow: 'Lend',
            title: '貸出処理',
            message: '貸出処理を受け付けました。'
        });
    };

    window.updateApproval = function (button, status) {
        const row = button ? button.closest('tr') : null;
        if (row) {
            row.classList.add('bg-emerald-50/40');
        }
        openGenericModal({
            eyebrow: 'Approval',
            title: status === 'Approved' ? '承認完了' : '承認状態更新',
            message: '申請の承認状態を更新しました。',
            meta: [['状態', status]]
        });
    };

    window.openIdCheckModal = function () {
        openGenericModal({
            eyebrow: 'Account',
            title: 'ID確認',
            message: '登録済みメールアドレスまたは電話番号からログインIDを確認します。',
            html: formField('氏名', 'text', '山田 太郎', '') + formField('メールアドレス', 'email', 'user@example.com', '')
        });
    };

    window.openPasswordResetModal = function () {
        openGenericModal({
            eyebrow: 'Security',
            title: 'パスワード再設定',
            message: '本人確認後、再設定用の案内を送信します。5回連続失敗で一時的にログインできなくなります。',
            html: formField('メールアドレス', 'email', 'user@example.com', '')
        });
    };

    window.openFirstPasswordChangeModal = function () {
        openGenericModal({
            eyebrow: 'First Login',
            title: '初回パスワード変更',
            message: '初回ログイン時は管理者発行パスワードから任意のパスワードへ変更します。',
            html: formField('現在のパスワード', 'password', '現在のパスワード', '') + formField('新しいパスワード', 'password', '英数字8文字以上', '') + formField('確認用パスワード', 'password', 'もう一度入力', '')
        });
    };

    window.openSnsLinkModal = function () {
        openGenericModal({
            eyebrow: 'SNS',
            title: 'SNS連携設定',
            message: 'Google、Apple、LINEの連携状態を確認し、ログイン手段を追加または解除できます。',
            meta: [
                ['Google', '未連携'],
                ['Apple', '未連携'],
                ['LINE', '未連携']
            ]
        });
    };

    window.openLogicalDeleteModal = function (target, email, currentStatus) {
        const employee = getEmployeeData(target, email, null, currentStatus);
        openGenericModal({
            eyebrow: '',
            title: '論理削除確認',
            message: 'データは履歴保持のため削除されず、一覧・ログイン対象から除外されます。',
            meta: [
                ['対象者', `${employee.lastName} ${employee.firstName}`],
                ['メールアドレス', employee.email],
                ['現在の在籍状態', currentStatus || employee.status]
            ],
            html: `
                <div class="mt-5 space-y-4">
                    ${textAreaField('employeeDeleteReason', '削除理由', '削除理由を入力してください', '', true)}
                    ${modalError('stockflowProcessError')}
                </div>
            `,
            actionText: '論理削除する',
            onAction: function () {
                const reason = document.getElementById('employeeDeleteReason')?.value.trim();
                if (!reason) return setProcessError('削除理由を入力してください。');
                showEmployeeComplete('論理削除完了', [
                    ['処理種類', '論理削除'],
                    ['対象者', `${employee.lastName} ${employee.firstName}`],
                    ['メールアドレス', employee.email],
                    ['処理前在籍状態', currentStatus || employee.status],
                    ['処理後状態', '一覧・ログイン対象外'],
                    ['削除理由', reason],
                    ['操作履歴', '記録対象']
                ]);
            }
        });
    };

    window.openEquipmentRegisterModal = function () {
        openGenericModal({
            eyebrow: 'Equipment',
            title: '備品登録',
            message: '備品1行を資産1個として登録します。',
            html: formField('備品名', 'text', 'MacBook Pro 14インチ', '') + formField('備品番号', 'text', 'EQ-2026-001', '') + formField('バーコード', 'text', 'SF-BC-2026-0001', '')
        });
    };

    window.openEquipmentEditModal = function (equipmentId) {
        openGenericModal({
            eyebrow: 'Equipment',
            title: '備品編集',
            message: '備品情報、状態、保管場所を編集します。',
            meta: [['備品ID', equipmentId]],
            html: formField('備品名', 'text', 'MacBook Pro 14インチ', '') + formField('保管場所', 'text', '本社 IT倉庫', '')
        });
    };

    window.openConsumeModal = function (itemName) {
        openGenericModal({
            eyebrow: 'Consume',
            title: '消費処理',
            message: '消耗品の消費数を登録し、在庫履歴に記録します。',
            meta: [['備品', itemName]],
            html: formField('消費数', 'number', '1', '')
        });
    };

    window.openReservationRegisterModal = function () {
        openGenericModal({
            eyebrow: 'Reservation',
            title: '予約登録',
            message: '重複予約と過去日予約を確認し、利用可能な場合は即時貸出へ進めます。',
            html: formField('備品名', 'text', 'MacBook Pro 14インチ', '') + formField('予約日', 'date', '', '') + `
                <label class="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-xs font-bold text-sky-700">
                    <input type="checkbox" class="rounded border-sky-300"> 即時貸出可能なら貸出登録へ進む
                </label>`
        });
    };

    window.openReservationDetailModal = function (reservationId) {
        openGenericModal({
            eyebrow: 'Reservation',
            title: '予約詳細',
            message: '予約状態と貸出可否を確認します。',
            meta: [
                ['予約ID', reservationId],
                ['状態', 'RESERVED'],
                ['注意', '重複予約・過去予約は登録不可']
            ]
        });
    };

    window.openNotificationModal = function (title) {
        openGenericModal({
            eyebrow: 'Notification',
            title: title || '通知詳細',
            message: '通知内容を確認しました。既読処理が可能です。',
            meta: [['状態', '未読']]
        });
    };

    window.removeFavorite = function (itemId) {
        const item = document.getElementById(itemId);
        if (item) {
            item.classList.add('opacity-40');
        }
        openGenericModal({
            eyebrow: 'Favorite',
            title: 'お気に入り解除',
            message: 'お気に入りから外しました。',
            meta: [['項目ID', itemId]]
        });
    };

    window.toggleStar = function (button) {
        if (!button) {
            return;
        }
        button.classList.toggle('text-amber-400');
        button.classList.toggle('text-slate-300');
    };

    window.toggleFormFields = function () {
        const enabled = document.getElementById('aiToggle')?.checked;
        document.querySelectorAll('[data-ai-field]').forEach(function (field) {
            field.disabled = !!enabled;
            field.classList.toggle('opacity-60', !!enabled);
        });
    };

    window.simulateAIFetch = function () {
        const fields = {
            equipmentName: 'MacBook Pro 14インチ',
            category: 'PC・端末',
            manufacturer: 'Apple',
            modelName: 'MacBook Pro 14'
        };
        Object.entries(fields).forEach(function ([id, value]) {
            const field = document.getElementById(id);
            if (field) {
                field.value = value;
            }
        });
        openGenericModal({
            eyebrow: 'AI',
            title: 'AI自動入力',
            message: '画像から読み取った備品情報を入力しました。'
        });
    };
})();
