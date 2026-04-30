
class CustomDateTimePicker {
    constructor(elementId, options = {}) {
        this.input = document.getElementById(elementId);
        this.options = Object.assign({
            format: 'YYYY-MM-DD HH:mm',
            onSelect: null
        }, options);
        
        this.currentDate = new Date();
        this.selectedDate = this.input.value ? new Date(this.input.value.replace(/-/g, '/')) : null;
        if (isNaN(this.selectedDate?.getTime())) this.selectedDate = null;

        this.init();
    }

    init() {
        // Create picker element
        this.picker = document.createElement('div');
        this.picker.className = 'fixed z-[999] hidden bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row';
        this.picker.style.minWidth = '450px';
        document.body.appendChild(this.picker);

        // Click to open
        this.input.style.cursor = 'pointer';
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.show();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.picker.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });

        this.render();
    }

    show() {
        const rect = this.input.getBoundingClientRect();
        this.picker.style.top = (rect.bottom + window.scrollY + 8) + 'px';
        this.picker.style.left = (rect.left + window.scrollX) + 'px';
        
        // Ensure within viewport
        const pickerRect = this.picker.getBoundingClientRect();
        if (rect.left + 450 > window.innerWidth) {
            this.picker.style.left = (window.innerWidth - 470) + 'px';
        }

        this.picker.classList.remove('hidden');
    }

    hide() {
        this.picker.classList.add('hidden');
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Left: Calendar
        const leftSide = `
            <div class="p-4 border-r border-slate-100 flex-1">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-1">
                        <span class="text-sm font-black text-slate-900">${year}年 ${month + 1}月</span>
                        <button class="p-1 hover:bg-slate-100 rounded text-slate-400" id="prevMonth"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
                        <button class="p-1 hover:bg-slate-100 rounded text-slate-400" id="nextMonth"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                    <div class="flex gap-2">
                        <button class="p-1 text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg></button>
                        <button class="p-1 text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></button>
                    </div>
                </div>
                <div class="grid grid-cols-7 text-center mb-2">
                    ${['日', '月', '火', '水', '木', '金', '土'].map(d => `<span class="text-[10px] font-bold text-slate-400">${d}</span>`).join('')}
                </div>
                <div class="grid grid-cols-7 gap-1" id="daysGrid">
                    ${this.generateDays(year, month)}
                </div>
                <div class="flex items-center justify-between mt-4">
                    <button class="text-xs font-bold text-sky-600 hover:bg-sky-50 px-2 py-1 rounded" id="clearDate">削除</button>
                    <button class="text-xs font-bold text-sky-600 hover:bg-sky-50 px-2 py-1 rounded" id="setToday">今日</button>
                </div>
            </div>
        `;

        // Right: Time Picker
        const rightSide = `
            <div class="w-[160px] bg-slate-50 flex flex-col p-4 gap-4 overflow-y-auto max-h-[300px]">
                <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest text-center">時間</span>
                    <div class="grid grid-cols-1 gap-1" id="hourGrid">
                        ${this.generateHours()}
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest text-center">分</span>
                    <div class="grid grid-cols-1 gap-1" id="minGrid">
                        ${this.generateMinutes()}
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest text-center">区分</span>
                    <div class="grid grid-cols-1 gap-1">
                        <button class="time-ampm-btn px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 transition-all ${this.getAMPM() === 'AM' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600'}" data-value="AM">午前</button>
                        <button class="time-ampm-btn px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 transition-all ${this.getAMPM() === 'PM' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600'}" data-value="PM">午後</button>
                    </div>
                </div>
            </div>
        `;

        this.picker.innerHTML = leftSide + rightSide;
        this.attachEvents();
    }

    generateDays(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDaysInMonth = new Date(year, month, 0).getDate();
        
        let html = '';
        // Prev month days
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<button class="h-8 w-8 flex items-center justify-center text-[11px] font-bold text-slate-300 cursor-not-allowed">${prevDaysInMonth - i}</button>`;
        }
        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = this.selectedDate && 
                               this.selectedDate.getFullYear() === year && 
                               this.selectedDate.getMonth() === month && 
                               this.selectedDate.getDate() === i;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i;
            
            html += `<button class="day-btn h-8 w-8 flex items-center justify-center text-[11px] font-bold rounded-lg transition-all ${isSelected ? 'bg-sky-600 text-white shadow-md' : isToday ? 'text-sky-600 border border-sky-200' : 'text-slate-700 hover:bg-slate-100'}" data-day="${i}">${i}</button>`;
        }
        return html;
    }

    generateHours() {
        let html = '';
        const currentHour = this.selectedDate ? this.selectedDate.getHours() % 12 || 12 : 9;
        for (let i = 1; i <= 12; i++) {
            const val = i.toString().padStart(2, '0');
            const isActive = currentHour === i;
            html += `<button class="hour-btn px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${isActive ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}" data-value="${i}">${val}</button>`;
        }
        return html;
    }

    generateMinutes() {
        let html = '';
        const currentMin = this.selectedDate ? this.selectedDate.getMinutes() : 0;
        const steps = [0, 15, 30, 45];
        steps.forEach(m => {
            const val = m.toString().padStart(2, '0');
            const isActive = currentMin === m;
            html += `<button class="min-btn px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${isActive ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}" data-value="${m}">${val}</button>`;
        });
        return html;
    }

    getAMPM() {
        if (!this.selectedDate) return 'AM';
        return this.selectedDate.getHours() >= 12 ? 'PM' : 'AM';
    }

    attachEvents() {
        // Month navigation
        this.picker.querySelector('#prevMonth').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        };
        this.picker.querySelector('#nextMonth').onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        };

        // Day selection
        this.picker.querySelectorAll('.day-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const day = parseInt(btn.dataset.day);
                if (!this.selectedDate) {
                    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day, 9, 0);
                } else {
                    this.selectedDate.setFullYear(this.currentDate.getFullYear());
                    this.selectedDate.setMonth(this.currentDate.getMonth());
                    this.selectedDate.setDate(day);
                }
                this.updateInput();
                this.render();
            };
        });

        // Hour selection
        this.picker.querySelectorAll('.hour-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (!this.selectedDate) this.selectedDate = new Date();
                let hour = parseInt(btn.dataset.value);
                const isPM = this.getAMPM() === 'PM';
                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                this.selectedDate.setHours(hour);
                this.updateInput();
                this.render();
            };
        });

        // Min selection
        this.picker.querySelectorAll('.min-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (!this.selectedDate) this.selectedDate = new Date();
                this.selectedDate.setMinutes(parseInt(btn.dataset.value));
                this.updateInput();
                this.render();
            };
        });

        // AM/PM selection
        this.picker.querySelectorAll('.time-ampm-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (!this.selectedDate) this.selectedDate = new Date();
                const val = btn.dataset.value;
                let hour = this.selectedDate.getHours();
                if (val === 'PM' && hour < 12) this.selectedDate.setHours(hour + 12);
                if (val === 'AM' && hour >= 12) this.selectedDate.setHours(hour - 12);
                this.updateInput();
                this.render();
            };
        });

        // Utilities
        this.picker.querySelector('#clearDate').onclick = (e) => {
            e.stopPropagation();
            this.selectedDate = null;
            this.input.value = '';
            if (this.options.onSelect) this.options.onSelect(null);
            this.render();
        };
        this.picker.querySelector('#setToday').onclick = (e) => {
            e.stopPropagation();
            this.selectedDate = new Date();
            this.currentDate = new Date();
            this.updateInput();
            this.render();
        };
    }

    updateInput() {
        if (!this.selectedDate) return;
        const y = this.selectedDate.getFullYear();
        const m = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const d = this.selectedDate.getDate().toString().padStart(2, '0');
        const hh = this.selectedDate.getHours().toString().padStart(2, '0');
        const mm = this.selectedDate.getMinutes().toString().padStart(2, '0');
        
        const val = `${y}-${m}-${d} ${hh}:${mm}`;
        this.input.value = val;
        
        if (this.options.onSelect) {
            this.options.onSelect(this.selectedDate);
        }
        
        // Dispatch change event
        this.input.dispatchEvent(new Event('change'));
    }
}
