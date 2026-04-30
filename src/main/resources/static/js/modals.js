(function () {
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
            <div id="stockflowGenericModalContent" class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden scale-95 opacity-0 transition-all duration-200">
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
                <div class="px-6 py-5">
                    <p id="stockflowGenericModalMessage" class="text-sm font-medium text-slate-600 leading-relaxed"></p>
                    <div id="stockflowGenericModalMeta" class="mt-4 space-y-2"></div>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" data-modal-close class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">閉じる</button>
                    <a id="stockflowGenericModalLink" href="#" class="hidden px-4 py-2 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition-colors">詳細を見る</a>
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

    function escapeHtml(value) {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function openGenericModal(options) {
        const modal = ensureGenericModal();
        document.getElementById('stockflowGenericModalEyebrow').textContent = options.eyebrow || 'Stockflow';
        document.getElementById('stockflowGenericModalTitle').textContent = options.title || '確認';
        document.getElementById('stockflowGenericModalMessage').textContent = options.message || '';
        document.getElementById('stockflowGenericModalMeta').innerHTML = (options.meta || [])
            .map(function (item) {
                return metaRow(item[0], item[1]);
            })
            .join('');

        const link = document.getElementById('stockflowGenericModalLink');
        if (options.href && options.href !== '#') {
            link.href = options.href;
            link.textContent = options.linkText || '詳細を見る';
            link.classList.remove('hidden');
        } else {
            link.classList.add('hidden');
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

    window.openDetailModal = function (type, title, name, status, startDate, endDate, detailUrl, body) {
        if (arguments.length === 0 && showExistingModal('detailModal')) {
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

    window.openReturnModal = function (rentalId, itemName, quantity) {
        openGenericModal({
            eyebrow: 'Return',
            title: '返却確認',
            message: 'この貸出を返却処理します。',
            meta: [
                ['貸出ID', rentalId],
                ['備品', itemName],
                ['数量', quantity]
            ]
        });
    };

    window.openExtendModal = function (rentalId, currentEndDate) {
        openGenericModal({
            eyebrow: 'Extend',
            title: '延長申請',
            message: '貸出期間の延長申請を行います。',
            meta: [
                ['貸出ID', rentalId],
                ['現在の期限', currentEndDate]
            ]
        });
    };

    window.openCancelModal = function (reservationId, userName) {
        if (showExistingModal('cancelModal')) {
            return;
        }
        openGenericModal({
            eyebrow: 'Cancel',
            title: '取消確認',
            message: 'この予約または申請を取消します。',
            meta: [
                ['ID', reservationId],
                ['利用者', userName]
            ]
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
            message: 'バーコード読み取り機能のポップアップです。'
        });
    };

    window.openCsvImportModal = function () {
        openGenericModal({
            eyebrow: 'CSV',
            title: 'CSVインポート',
            message: 'CSVファイルから備品情報を取り込むためのポップアップです。'
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
            eyebrow: 'Register',
            title: '利用者登録',
            message: '新しい利用者を登録するためのポップアップです。'
        });
    };

    window.openEditModal = function () {
        openGenericModal({
            eyebrow: 'Edit',
            title: '編集',
            message: '選択した情報を編集するためのポップアップです。'
        });
    };

    window.openRequestModal = function () {
        openGenericModal({
            eyebrow: 'Request',
            title: '要望申請',
            message: '新しい要望を申請するためのポップアップです。'
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
            eyebrow: 'Cancel',
            title: '取消確認',
            message: 'この申請を取消します。',
            meta: [['申請ID', requestId]]
        });
    };

    window.confirmCancelReturn = function (rentalId) {
        openGenericModal({
            eyebrow: 'Cancel',
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
            eyebrow: 'Return',
            title: '返却処理',
            message: '返却処理を受け付けました。'
        });
    };

    window.saveExtend = function () {
        openGenericModal({
            eyebrow: 'Extend',
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
