const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector("#chatbox");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const chatbotCloseBtn = document.querySelector("#close-chat-btn");
const modelSelect = document.querySelector("#model-select");
const headerModelName = document.querySelector("#header-model-name");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");

let userMessage;
let API_KEY = "YOUR_GEMINI_API_KEY";
const inputInitHeight = chatInput ? chatInput.scrollHeight : 38;

// Toast Notification
window.showToast = (message) => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="material-symbols-outlined" style="color:#10b981">check_circle</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
};

// Switch Dashboard Views
window.switchView = (viewName) => {
    const views = document.querySelectorAll(".content-view");
    views.forEach(v => v.classList.remove("active"));
    
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

// Nav Click Handler
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const viewName = item.getAttribute("data-view");
        if (viewName) switchView(viewName);
    });
});

// Plugin Toggler
window.togglePlugin = (pluginName, checkboxElement) => {
    if (checkboxElement.checked) {
        showToast(`${pluginName} enabled`);
    } else {
        showToast(`${pluginName} disabled`);
    }
};

// Save API Key
window.saveApiKey = () => {
    const input = document.getElementById("api-key-input");
    if (input && input.value.trim()) {
        API_KEY = input.value.trim();
        showToast("API key updated!");
    } else {
        showToast("Enter a valid key.");
    }
};

// Save All Settings
window.saveAllSettings = () => {
    showToast("Settings saved!");
};

// Copy Text
window.copyMessageText = (btnElement) => {
    const messageP = btnElement.closest(".message-content").querySelector("p");
    if (!messageP) return;
    navigator.clipboard.writeText(messageP.textContent).then(() => {
        showToast("Copied!");
    });
};

// Clear Chat History
window.clearChatHistory = () => {
    chatbox.innerHTML = `
        <li class="chat incoming">
            <span class="material-symbols-outlined bot-avatar">smart_toy</span>
            <div class="message-content">
                <p>Hello 👋 How can I help you today?</p>
            </div>
        </li>
    `;
    showToast("Chat cleared");
};

// Start New Chat
window.startNewChat = () => {
    document.body.classList.add("show-chatbot");
    clearChatHistory();
    if (chatInput) chatInput.focus();
};

// Create Chat Li
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    
    if (className === "outgoing") {
        chatLi.innerHTML = `
            <div class="message-content">
                <p></p>
            </div>
        `;
        chatLi.querySelector("p").textContent = message;
    } else {
        chatLi.innerHTML = `
            <span class="material-symbols-outlined bot-avatar">smart_toy</span>
            <div class="message-content">
                <button class="copy-btn" onclick="copyMessageText(this)">Copy</button>
                <p></p>
            </div>
        `;
        if (typeof message === "string") {
            chatLi.querySelector("p").textContent = message;
        } else {
            chatLi.querySelector("p").appendChild(message);
        }
    }
    return chatLi;
};

// Generate AI Response
const generateResponse = (incomingChatLI) => {
    const messageElement = incomingChatLI.querySelector("p");
    const selectedModel = modelSelect ? modelSelect.value : "gemini-3.6-flash";
    const cleanKey = API_KEY.trim();

    // Friendly validation check if API key is not configured yet
    if (!cleanKey || cleanKey === "YOUR_GEMINI_API_KEY" || cleanKey.length < 10) {
        messageElement.classList.add("error");
        messageElement.innerHTML = `🔑 <strong>API Key Required</strong><br>Please enter your <strong>Google Gemini API Key</strong> or <strong>OpenAI Key</strong> under <strong>Settings ⚙️</strong> in the sidebar to enable live AI responses.<br><br><button class="small-btn" onclick="switchView('settings')" style="margin-top:6px;"><span class="material-symbols-outlined" style="font-size:0.9rem;vertical-align:middle;">settings</span> Open Settings</button>`;
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    const isOpenAI = cleanKey.startsWith("sk-") || selectedModel.includes("gpt");
    
    let API_URL, requestOptions;
    
    if (isOpenAI) {
        API_URL = "https://api.openai.com/v1/chat/completions";
        requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cleanKey}`
            },
            body: JSON.stringify({
                model: selectedModel.includes("gpt") ? selectedModel : "gpt-4o-mini",
                messages: [{ role: "user", content: userMessage }]
            })
        };
    } else {
        API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${cleanKey}`;
        requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              contents: [{ 
                role: "user", 
                parts: [{ text: userMessage }] 
              }] 
            }),
        };
    }

    fetch(API_URL, requestOptions).then(res => {
        if (!res.ok) {
            return res.json().then(errData => {
                throw new Error(errData.error?.message || "API request failed. Please check your API key.");
            });
        }
        return res.json();
    }).then(data => {
        if (isOpenAI) {
            messageElement.textContent = data.choices[0].message.content.trim();
        } else {
            messageElement.textContent = data.candidates[0].content.parts[0].text;
        }
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = error.message || "Oops! Something went wrong. Please check your API Key in Settings.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));    
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const typingDots = document.createElement("span");
        typingDots.className = "typing-dots";
        typingDots.innerHTML = "<span></span><span></span><span></span>";

        const incomingChatLI = createChatLi(typingDots, "incoming");
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        generateResponse(incomingChatLI);
    }, 400);
};

// Event Listeners
if (sendChatBtn) sendChatBtn.addEventListener("click", handleChat);

if (chatbotToggler) {
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
}

if (chatbotCloseBtn) {
    chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
}

if (chatInput) {
    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
}

// Quick Prompt Handler
window.sendQuickPrompt = (promptText) => {
    document.body.classList.add("show-chatbot");
    chatInput.value = promptText;
    chatInput.dispatchEvent(new Event('input'));
    handleChat();
};

// Mobile Sidebar Toggle
const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const sidebarCloseBtn = document.querySelector("#sidebar-close-btn");
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");

const closeMobileSidebar = () => {
    if (sidebar) sidebar.classList.remove("show-mobile");
    if (sidebarOverlay) sidebarOverlay.classList.remove("show-mobile");
};

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        if (sidebar) sidebar.classList.toggle("show-mobile");
        if (sidebarOverlay) sidebarOverlay.classList.toggle("show-mobile");
    });
}

if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
}

// Close mobile sidebar on navigation click
const mobileNavItems = document.querySelectorAll(".nav-item");
mobileNavItems.forEach(item => {
    item.addEventListener("click", closeMobileSidebar);
});

// Global Chart Instances
let dashboardMainChart = null;
let dashboardLatencyChart = null;
let analyticsTokenChart = null;
let analyticsDistChart = null;

// Chart Datasets for different time ranges
const chartDataRanges = {
    '1h': {
        labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00'],
        latency: [0.35, 0.29, 0.31, 0.24, 0.28, 0.26, 0.28],
        requests: [42, 58, 65, 80, 72, 85, 94]
    },
    '24h': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        latency: [0.42, 0.38, 0.30, 0.28, 0.32, 0.29, 0.27],
        requests: [210, 180, 450, 890, 920, 680, 410]
    },
    '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        latency: [0.38, 0.34, 0.31, 0.29, 0.28, 0.25, 0.28],
        requests: [2400, 3100, 4200, 4820, 5100, 3900, 4100]
    },
    '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        latency: [0.45, 0.38, 0.32, 0.28],
        requests: [15400, 22100, 28900, 34820]
    }
};

// Initialize Chart.js Graphs
const initCharts = () => {
    if (typeof Chart === 'undefined') return;

    const isLight = document.body.classList.contains("light-theme");
    const textColor = isLight ? "#475569" : "#94a3b8";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)";

    // 1. Dashboard Mini Latency Sparkline Chart
    const latencyCanvas = document.getElementById("dashboardLatencyChart");
    if (latencyCanvas) {
        const existingLatencyChart = Chart.getChart(latencyCanvas);
        if (existingLatencyChart) existingLatencyChart.destroy();
        if (dashboardLatencyChart) {
            try { dashboardLatencyChart.destroy(); } catch (e) {}
        }

        const ctx = latencyCanvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 80);
        gradient.addColorStop(0, "rgba(168, 85, 247, 0.4)");
        gradient.addColorStop(1, "rgba(168, 85, 247, 0.0)");

        dashboardLatencyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{
                    data: [0.35, 0.31, 0.29, 0.34, 0.27, 0.30, 0.25, 0.28, 0.26, 0.28],
                    borderColor: '#c084fc',
                    borderWidth: 2.5,
                    fill: true,
                    backgroundColor: gradient,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }

    // 2. Dashboard Main Interactive Performance Chart
    const mainCanvas = document.getElementById("dashboardMainChart");
    if (mainCanvas) {
        const existingMainChart = Chart.getChart(mainCanvas);
        if (existingMainChart) existingMainChart.destroy();
        if (dashboardMainChart) {
            try { dashboardMainChart.destroy(); } catch (e) {}
        }

        const ctx = mainCanvas.getContext("2d");

        const gradientPurple = ctx.createLinearGradient(0, 0, 0, 220);
        gradientPurple.addColorStop(0, "rgba(124, 58, 237, 0.45)");
        gradientPurple.addColorStop(1, "rgba(124, 58, 237, 0.01)");

        const gradientCyan = ctx.createLinearGradient(0, 0, 0, 220);
        gradientCyan.addColorStop(0, "rgba(56, 189, 248, 0.35)");
        gradientCyan.addColorStop(1, "rgba(56, 189, 248, 0.01)");

        dashboardMainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartDataRanges['1h'].labels,
                datasets: [
                    {
                        label: 'API Requests',
                        data: chartDataRanges['1h'].requests,
                        borderColor: '#38bdf8',
                        borderWidth: 3,
                        backgroundColor: gradientCyan,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'yRequests'
                    },
                    {
                        label: 'Latency (sec)',
                        data: chartDataRanges['1h'].latency,
                        borderColor: '#c084fc',
                        borderWidth: 3,
                        backgroundColor: gradientPurple,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'yLatency'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        boxPadding: 4
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: 'JetBrains Mono' } }
                    },
                    yRequests: {
                        type: 'linear',
                        position: 'left',
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: 'JetBrains Mono' } },
                        title: { display: true, text: 'Requests', color: '#38bdf8' }
                    },
                    yLatency: {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: textColor, font: { family: 'JetBrains Mono' } },
                        title: { display: true, text: 'Latency (s)', color: '#c084fc' }
                    }
                }
            }
        });
    }

    // 3. Analytics Token Bar Chart
    const tokenCanvas = document.getElementById("analyticsTokenChart");
    if (tokenCanvas) {
        const existingTokenChart = Chart.getChart(tokenCanvas);
        if (existingTokenChart) existingTokenChart.destroy();
        if (analyticsTokenChart) {
            try { analyticsTokenChart.destroy(); } catch (e) {}
        }

        const ctx = tokenCanvas.getContext("2d");
        analyticsTokenChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tokens Used',
                    data: [4200, 6800, 8900, 11400, 9500, 4300, 3190],
                    backgroundColor: 'rgba(168, 85, 247, 0.75)',
                    hoverBackgroundColor: '#a855f7',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });
    }

    // 4. Analytics Request Distribution Doughnut Chart
    const distCanvas = document.getElementById("analyticsDistChart");
    if (distCanvas) {
        const existingDistChart = Chart.getChart(distCanvas);
        if (existingDistChart) existingDistChart.destroy();
        if (analyticsDistChart) {
            try { analyticsDistChart.destroy(); } catch (e) {}
        }

        const ctx = distCanvas.getContext("2d");
        analyticsDistChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Code Generation', 'General Q&A', 'Email & Writing', 'Data Analysis'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#a855f7', '#38bdf8', '#4ade80', '#fb923c'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
                    }
                },
                cutout: '70%'
            }
        });
    }
};

// Update Chart Time Range (1H, 24H, 7D, 30D)
window.updateChartRange = (range, btnElement) => {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => btn.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    if (dashboardMainChart && chartDataRanges[range]) {
        dashboardMainChart.data.labels = chartDataRanges[range].labels;
        dashboardMainChart.data.datasets[0].data = chartDataRanges[range].requests;
        dashboardMainChart.data.datasets[1].data = chartDataRanges[range].latency;
        dashboardMainChart.update();
        showToast(`Chart view updated to ${range.toUpperCase()}`);
    }
};

// Safe Chart Initialization Trigger
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initCharts, 50);
} else {
    document.addEventListener("DOMContentLoaded", () => {
        initCharts();
    });
}

// Dark / Light Theme Toggle Listener (Update Chart colors)
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        showToast(`Switched to ${isLight ? "Light" : "Dark"} theme`);

        const textColor = isLight ? "#475569" : "#94a3b8";
        const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)";

        [dashboardMainChart, analyticsTokenChart].forEach(chart => {
            if (chart) {
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
                if (chart.options.scales.y) chart.options.scales.y.ticks.color = textColor;
                if (chart.options.scales.yRequests) chart.options.scales.yRequests.ticks.color = textColor;
                if (chart.options.scales.yLatency) chart.options.scales.yLatency.ticks.color = textColor;
                chart.update();
            }
        });
    });
}

