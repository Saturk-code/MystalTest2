// js/main.js
document.addEventListener("DOMContentLoaded", () => {
    // Копирование IP
    const copyIpBtn = document.getElementById("copyIpBtn");
    if (copyIpBtn) {
        copyIpBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(SERVER_CONFIG.ip).then(() => {
                const toast = document.getElementById("copyToast");
                if (toast) {
                    toast.style.opacity = "1";
                    setTimeout(() => toast.style.opacity = "0", 2000);
                }
            }).catch(() => alert("Не удалось скопировать IP: " + SERVER_CONFIG.ip));
        });
    }

    // Дискорд кнопки (все элементы с классом discord-link)
    const discordBtns = document.querySelectorAll(".discord-link");
    discordBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            window.open(SERVER_CONFIG.discordInvite, "_blank");
        });
    });

    // Подсветка активного пункта меню (для текущей страницы)
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Загрузка онлайн-статуса (только на главной)
    const statusContainer = document.getElementById("onlineStatus");
    if (statusContainer) {
        fetchOnlineStatus();
        setInterval(fetchOnlineStatus, 60000); // обновлять раз в минуту
    }
});

async function fetchOnlineStatus() {
    const statusContainer = document.getElementById("onlineStatus");
    if (!statusContainer) return;
    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${SERVER_CONFIG.ip}`);
        const data = await response.json();
        if (data.online) {
            statusContainer.innerHTML = `
                <span class="status-dot"></span>
                <span>Онлайн: <strong>${data.players.online}</strong> / ${data.players.max}</span>
                <span>Версия: ${data.version || "?"}</span>
            `;
        } else {
            statusContainer.innerHTML = `
                <span class="status-dot" style="background-color:#e74c3c; box-shadow:none;"></span>
                <span>Сервер офлайн</span>
            `;
        }
    } catch (error) {
        statusContainer.innerHTML = `<span>⚠️ Не удалось загрузить статус</span>`;
    }
}
