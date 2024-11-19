document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const scheduleMenu = document.getElementById('schedule-menu');
    const saveButton = document.getElementById('save-appointment');
    const deleteButton = document.getElementById('delete-appointment');
    const cancelButton = document.getElementById('cancel-appointment');
    const titleInput = document.getElementById('appointment-title');
    const dateInput = document.getElementById('appointment-date');
    const estheticianInput = document.getElementById('appointment-esthetician');
    const proceduresCheckboxes = document.querySelectorAll('.procedures-container .procedure-item input[type="checkbox"]');
    const eventListEl = document.getElementById('event-items');
    let currentEvent = null;

    // Esconde o menu de agendamento inicialmente
    scheduleMenu.style.display = 'none';

    // Função para abrir o menu de agendamento
    function openScheduleMenu() {
        scheduleMenu.style.display = 'flex';
    }

    // Função para fechar o menu de agendamento
    function closeScheduleMenu() {
        scheduleMenu.style.display = 'none';
        resetForm();
    }

    // Função para resetar o formulário
    function resetForm() {
        titleInput.value = '';
        dateInput.value = '';
        estheticianInput.selectedIndex = 0;
        proceduresCheckboxes.forEach(checkbox => (checkbox.checked = false));
        currentEvent = null;
    }

    // Função para capturar os procedimentos selecionados
    function getSelectedProcedures() {
        return Array.from(proceduresCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());
    }

    // Função para marcar os checkboxes de procedimentos no formulário
    function setSelectedProcedures(procedures) {
        proceduresCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent.trim();
            checkbox.checked = procedures.includes(label);
        });
    }

    // Função para determinar a cor do agendamento com base na esteticista
    function getColorByEsthetician(esthetician) {
        switch (esthetician) {
            case 'Ana':
                return { backgroundColor: '#f8bbd0', borderColor: '#f48fb1' };
            case 'Bia':
                return { backgroundColor: '#bbdefb', borderColor: '#90caf9' };
            case 'Carol':
                return { backgroundColor: '#c8e6c9', borderColor: '#a5d6a7' };
            default:
                return { backgroundColor: '#e3f2fd', borderColor: '#90caf9' };
        }
    }

    function updateEventList() {
        const events = calendar.getEvents();
        eventListEl.innerHTML = ''; // Limpa a lista de eventos
        events.forEach(event => {
            const procedures = event.extendedProps.procedures || [];
            const formattedProcedures = procedures.length > 0 ? procedures.join(', ') : 'Nenhum procedimento';
    
            const colors = getColorByEsthetician(event.extendedProps.esthetician || ''); // Obtém as cores
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
    
            // Aplica as cores no estilo inline
            eventItem.style.backgroundColor = colors.backgroundColor;
            eventItem.style.borderLeft = `5px solid ${colors.borderColor}`;
            eventItem.style.padding = '10px';
            eventItem.style.marginBottom = '10px';
            eventItem.style.borderRadius = '5px';
    
            eventItem.innerHTML = `
                <div><strong>${event.title}</strong></div>
                <div>Data: ${event.start.toLocaleDateString()} - Hora: ${event.start.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hourCycle: 'h23'
                })}</div>
                <div>Esteticista: ${event.extendedProps.esthetician || 'N/A'}</div>
                <div>Procedimentos: ${formattedProcedures}</div>
            `;
            eventListEl.appendChild(eventItem);
        });
    }
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        dateClick: function (info) {
            dateInput.value = info.dateStr + 'T09:00';
            openScheduleMenu();
        },
        eventClick: function (info) {
            currentEvent = info.event;
            titleInput.value = currentEvent.title;
            dateInput.value = currentEvent.start.toISOString().slice(0, -1);
            estheticianInput.value = currentEvent.extendedProps.esthetician || '';
            setSelectedProcedures(currentEvent.extendedProps.procedures || []);
            openScheduleMenu();
        },
    });

    // Função para salvar o agendamento
    saveButton.addEventListener('click', function () {
        const title = titleInput.value;
        const esthetician = estheticianInput.value;
        const date = dateInput.value;
        const selectedProcedures = getSelectedProcedures();

        if (title && esthetician && date) {
            const colors = getColorByEsthetician(esthetician);

            if (currentEvent) {
                // Atualiza o evento existente
                currentEvent.setProp('title', title);
                currentEvent.setStart(date);
                currentEvent.setExtendedProp('esthetician', esthetician);
                currentEvent.setExtendedProp('procedures', selectedProcedures);
                currentEvent.setProp('backgroundColor', colors.backgroundColor);
                currentEvent.setProp('borderColor', colors.borderColor);
            } else {
                // Adiciona um novo evento
                calendar.addEvent({
                    title: title,
                    start: date,
                    extendedProps: {
                        esthetician: esthetician,
                        procedures: selectedProcedures,
                    },
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                });
            }

            updateEventList(); // Atualiza a lista lateral
            closeScheduleMenu();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    // Função para deletar o agendamento
    deleteButton.addEventListener('click', function () {
        if (currentEvent) {
            currentEvent.remove();
            updateEventList(); // Atualiza a lista lateral
            closeScheduleMenu();
        }
    });

    // Função para cancelar e fechar o menu de agendamento
    cancelButton.addEventListener('click', function () {
        closeScheduleMenu();
    });

    calendar.render();
});
