// ChatLLM Interface Logic
// 全局变量来控制自动滚动
let autoScroll = true;

// 滚动到底部函数
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (autoScroll && chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else if (chatMessages) {
        // 显示滚动控制按钮
        const scrollControl = document.getElementById('scroll-control');
        if (scrollControl) {
            scrollControl.style.display = 'flex';
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
    /* 人类角色相关样式 */
    .human-message, .user {
        border-left: none;
        border-right: 4px solid #6c757d;
        background-color: rgba(0, 123, 255, 0.05);
        margin-left: auto;
        margin-right: 0;
        text-align: right;
        max-width: 80%;
        border-radius: 8px;
    }
    
    .ai {
        border-left: 4px solid #6c757d;
        border-right: none;
        background-color: rgba(108, 117, 125, 0.05);
        margin-left: 0;
        margin-right: auto;
        text-align: left;
        max-width: 80%;
        border-radius: 8px;
    }
    
    .message-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 8px;
    }
    
    .message-name {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .user .message-name, .human-message .message-name {
        text-align: right;
    }
    
    .ai .message-name {
        text-align: left;
    }
    
    .human-badge {
        background-color: #007bff !important;
        color: white !important;
    }
    
    .waiting-human {
        border-left: 4px solid #ff9800;
        background-color: rgba(255, 152, 0, 0.05);
        font-style: italic;
    }
    
    #humanInputArea {
        border: 2px solid #007bff;
        padding: 15px;
        border-radius: 8px;
        background-color: rgba(0, 123, 255, 0.05);
        margin-top: 20px;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
        transition: all 0.3s ease;
    }
    
    #humanInputArea.d-none {
        display: none !important;
    }
    
    #humanRoleName {
        font-weight: bold;
        color: #007bff;
    }
    
    #humanInputMessage {
        border: 1px solid #007bff;
    }
    
    #sendHumanInput {
        background-color: #007bff;
        border-color: #007bff;
    }
    
    #sendHumanInput:hover {
        background-color: #0069d9;
        border-color: #0062cc;
    }
    
    /* 讨论组相关样式 */
    .discussion-topic {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #28a745;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .discussion-topic h3 {
        margin: 0;
        color: #28a745;
    }
    
    .agent-message {
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        border-left: 4px solid #6c757d;
    }
    
    .agent-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }
    
    .agent-name {
        font-weight: bold;
        color: #495057;
    }
    
    .agent-badge {
        font-size: 0.75rem;
        padding: 3px 8px;
        border-radius: 12px;
        background-color: #6c757d;
        color: white;
    }
    
    .agent-content {
        padding: 15px;
        background-color: white;
        line-height: 1.6;
    }
    
    /* 思考内容折叠样式 */
    .thinking-container {
        margin-bottom: 10px;
        border-bottom: 1px dashed #ccc;
        padding-bottom: 10px;
        width: 100%;
        display: block;
    }
    
    .thinking-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        color: #6c757d;
        font-size: 0.9rem;
        margin-bottom: 6px;
    }
    
    .thinking-header:hover {
        color: #495057;
    }
    
    .thinking-toggle-icon {
        margin-right: 6px;
        transition: transform 0.3s;
    }
    
    .thinking-toggle-icon.collapsed {
        transform: rotate(-90deg);
    }
    
    .thinking-content {
        background-color: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        font-size: 0.9rem;
        border-left: 3px solid #6c757d;
        overflow: hidden;
        transition: max-height 0.3s ease-out, opacity 0.3s ease;
        max-height: 600px;
        opacity: 1;
        width: 100%;
        box-sizing: border-box;
    }
    
    .thinking-content.collapsed {
        max-height: 0;
        padding: 0;
        border-width: 0;
        opacity: 0;
    }
    
    /* 确保消息容器中的元素垂直排列 */
    .message-container {
        display: flex;
        flex-direction: column;
    }
    
    /* 确保消息内容占据全宽 */
    .message-content {
        width: 100%;
        box-sizing: border-box;
    }
    
    /* 确保代理消息中的内容也是垂直排列 */
    .agent-message {
        display: flex;
        flex-direction: column;
    }
    
    .agent-content {
        width: 100%;
        box-sizing: border-box;
    }
    
    /* 暗色主题下的思考内容样式 */
    body.dark-theme .thinking-container {
        border-top: 1px dashed #555;
    }
    
    body.dark-theme .thinking-header {
        color: #adb5bd;
    }
    
    body.dark-theme .thinking-header:hover {
        color: #e9ecef;
    }
    
    body.dark-theme .thinking-content {
        background-color: #2d2d2d;
        border-left-color: #495057;
    }
    
    /* 聊天区域滚动控制 */
    #chat-messages {
        scroll-behavior: smooth;
        overflow-y: auto;
        height: calc(100vh - 200px);
    }
    
    /* 用于控制是否自动滚动的标志 */
    .auto-scroll-disabled {
        cursor: pointer;
    }
    
    /* 滚动控制按钮 */
    #scroll-control {
        position: fixed;
        bottom: 100px;
        right: 20px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    
    #scroll-control:hover {
        opacity: 1;
    }
    
    /* 暗色主题适配 */
    body.dark-theme .user,
    body.dark-theme .human-message {
        background-color: rgba(0, 123, 255, 0.15);
    }
    
    body.dark-theme .ai {
        background-color: rgba(108, 117, 125, 0.15);
    }
    
    /* 总结消息特殊样式 */
    .summary-message {
        border-left: 4px solid #28a745;
        background-color: rgba(40, 167, 69, 0.05);
        margin-top: 30px;
    }
    
    .summary-message .agent-header {
        background-color: rgba(40, 167, 69, 0.1);
    }
    
    .summary-message .agent-name {
        color: #28a745;
    }
    
    .summary-message .agent-badge {
        background-color: #28a745;
    }
    
    .summary-message .agent-content {
        background-color: rgba(255, 255, 255, 0.7);
    }
    
    /* 轮次信息样式 */
    .round-info {
        margin-bottom: 15px;
        padding: 8px 12px;
        background-color: #f8f9fa;
        border-radius: 6px;
        font-size: 0.9rem;
        color: #6c757d;
        text-align: center;
    }
    
    .dark-round-info {
        background-color: #2d2d2d;
        color: #adb5bd;
    }
    
    /* 代码块样式 */
    .agent-content pre,
    .agent-content code {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 0.2em 0.4em;
        font-size: 0.9em;
        border: 1px solid #e9ecef;
    }
    
    .agent-content pre {
        padding: 1em;
        overflow-x: auto;
    }
    
    .agent-content pre code {
        background-color: transparent;
        padding: 0;
        border: none;
    }
    
    .dark-code {
        background-color: #2c3e50 !important;
        color: #e74c3c !important;
        border-color: #34495e !important;
    }
    
    /* 讨论组暗色主题样式 */
    body.dark-theme .discussion-topic {
        background-color: #252525;
        border-left: 4px solid #2ecc71;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    body.dark-theme .discussion-topic h3 {
        color: #2ecc71;
    }
    
    body.dark-theme .agent-message {
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border-left: 4px solid #6c757d;
    }
    
    body.dark-theme .agent-header {
        background-color: #2d2d2d;
        border-bottom: 1px solid #404040;
    }
    
    body.dark-theme .agent-name {
        color: #ecf0f1;
    }
    
    body.dark-theme .agent-badge {
        background-color: #555;
    }
    
    body.dark-theme .agent-content {
        background-color: #1e1e1e;
        color: #ecf0f1;
    }
    
    /* 总结消息暗色主题特殊样式 */
    body.dark-theme .summary-message {
        border-left: 4px solid #2ecc71;
        background-color: rgba(46, 204, 113, 0.1);
    }
    
    body.dark-theme .summary-message .agent-header {
        background-color: rgba(46, 204, 113, 0.15);
    }
    
    body.dark-theme .summary-message .agent-name {
        color: #2ecc71;
    }
    
    body.dark-theme .summary-message .agent-badge {
        background-color: #27ae60;
    }
    
    body.dark-theme .summary-message .agent-content {
        background-color: rgba(30, 30, 30, 0.8);
        color: #ecf0f1;
    }
    
    /* 黑暗模式下的代码块样式 */
    body.dark-theme .agent-content pre,
    body.dark-theme .agent-content code {
        background-color: #2c3e50;
        color: #e74c3c;
        border: 1px solid #34495e;
    }
    
    /* 黑暗模式下的超链接样式 */
    body.dark-theme .agent-content a {
        color: #3498db;
    }
    
    body.dark-theme .agent-content a:hover {
        color: #2980b9;
        text-decoration: underline;
    }
    
    .message-content {
        padding: 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        white-space: pre-wrap;
        word-break: break-word;
    }
    
    .human-message .message-content, .user .message-content {
        text-align: right;
    }
    
    .ai .message-content {
        text-align: left;
    }
    
    .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .message-header {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }
    
    .user .message-header, .human-message .message-header {
        flex-direction: row-reverse;
        justify-content: flex-start;
    }
    
    .user .message-avatar, .human-message .message-avatar {
        margin-right: 0;
        margin-left: 12px;
    }
    
    .text-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
    }
    
    .ai-avatar {
        background-color: #007bff;
    }
    
    .user-avatar {
        background-color: #6c757d;
    }
    `;
    document.head.appendChild(style);

    // 全局变量
    let currentChatMode = "single"; // 默认为单模型对话
    let currentModelId = null;
    let currentRelayId = null;
    let currentRoleId = null;
    let currentGroupId = null;
    let currentMeetingId = null;
    let messageHistory = [];
    let humanRoles = [];
    let isWaitingForHumanInput = false;
    let defaultApiKey = 'sk-api-deepgemini-default';
    let humanCheckInterval = null;  // 添加人类输入检查定时器变量
    let waitingForHumanName = null;  // 添加跟踪当前等待输入的人类角色名称
    
    // DOM元素
    const chatModeRadios = document.querySelectorAll('input[name="chatMode"]');
    const settingSections = document.querySelectorAll('.chat-setting-section');
    const singleModelSelect = document.getElementById('singleModelSelect');
    const relayChainSelect = document.getElementById('relayChainSelect');
    const roleChatSelect = document.getElementById('roleChatSelect');
    const discussionGroupSelect = document.getElementById('discussionGroupSelect');
    const discussionTopic = document.getElementById('discussionTopic');
    const chatMessages = document.getElementById('chatMessages');
    const userMessage = document.getElementById('userMessage');
    const sendMessageBtn = document.getElementById('sendMessage');
    const humanInputArea = document.getElementById('humanInputArea');
    const humanRoleName = document.getElementById('humanRoleName');
    const humanInputMessage = document.getElementById('humanInputMessage');
    const sendHumanInputBtn = document.getElementById('sendHumanInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // 创建并添加滚动控制按钮
    const scrollControl = document.createElement('div');
    scrollControl.id = 'scroll-control';
    scrollControl.innerHTML = '<i class="fas fa-arrow-down"></i>';
    scrollControl.style.display = 'none';
    document.body.appendChild(scrollControl);
    
    // 滚动控制按钮点击事件
    scrollControl.addEventListener('click', function() {
        // console.log("滚动按钮被点击");
        autoScroll = true;
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
            this.style.display = 'none';
        }
    });
    
    // 监听聊天区域滚动事件
    if (chatMessages) {
        chatMessages.addEventListener('wheel', function() {
            // 检查是否已滚动到底部
            const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + 50;
            autoScroll = isAtBottom;
            
            // 如果不在底部，显示滚动控制按钮
            scrollControl.style.display = isAtBottom ? 'none' : 'flex';
            // console.log("滚动事件触发，自动滚动状态:", autoScroll);
        });
    }
    
    // 确保加载状态初始隐藏
    if (loadingSpinner) {
        loadingSpinner.classList.remove('show');
    }
    
    // 获取默认API密钥
    fetchDefaultApiKey();
    
    // 初始化
    init();
    
    // 监听主题切换
    document.addEventListener('themeChanged', function(e) {
        const isDarkMode = document.body.classList.contains('dark-theme');
        // console.log(`主题切换: ${isDarkMode ? '暗色' : '亮色'}`);
        
        // 更新讨论组代码块样式
        const codeBlocks = document.querySelectorAll('.agent-content pre code');
        codeBlocks.forEach(block => {
            if (isDarkMode) {
                block.classList.add('dark-code');
            } else {
                block.classList.remove('dark-code');
            }
        });
        
        // 更新轮次信息样式
        const roundInfoElements = document.querySelectorAll('.round-info');
        roundInfoElements.forEach(el => {
            if (isDarkMode) {
                el.classList.add('dark-round-info');
            } else {
                el.classList.remove('dark-round-info');
            }
        });
    });
    
    // 初始检查主题并应用相应样式
    if (document.body.classList.contains('dark-theme')) {
        // 触发一次主题变化事件以应用样式
        document.dispatchEvent(new CustomEvent('themeChanged'));
    }
    
    // 事件监听
    chatModeRadios.forEach(radio => {
        radio.addEventListener('change', handleChatModeChange);
    });
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (userMessage) {
        userMessage.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (sendHumanInputBtn) {
        sendHumanInputBtn.addEventListener('click', sendHumanInput);
    }
    
    // 移除所有现有的事件监听器，确保不会重复绑定
    if (humanInputMessage) {
        const existingListener = humanInputMessage._keydownListener;
        if (existingListener) {
            humanInputMessage.removeEventListener('keydown', existingListener);
        }
        
        // 创建新的事件监听器并保存引用
        humanInputMessage._keydownListener = e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // 阻止事件冒泡
                e.stopPropagation();
                // 调用发送函数
                sendHumanInput();
                // 重置等待状态
                isWaitingForHumanInput = false;
                waitingForHumanName = null;
            }
        };
        
        // 添加新的事件监听器
        humanInputMessage.addEventListener('keydown', humanInputMessage._keydownListener);
    }
    
    // 初始化函数
    async function init() {
        // 初始化语言
        updateTranslations();
        
        // 初始化Marked选项
        setupMarkedOptions();

        try {
            // 加载默认API密钥
            await fetchDefaultApiKey();
            
            // 加载模型列表
            await loadModels();
            
            // 加载配置
            await loadConfigurations();
            
            // 加载角色列表
            await loadRoles();
            
            // 加载讨论组列表
            await loadGroups();
            
            // 加载人类角色列表
            await loadHumanRoles();
            
            // 设置初始聊天模式
            setActiveChatMode('single');
            
            // 设置聊天模式切换监听
            document.querySelectorAll('input[name="chatMode"]').forEach(radio => {
                radio.addEventListener('change', handleChatModeChange);
            });
            
            // 初始化发送消息按钮事件
            document.getElementById('sendMessage').addEventListener('click', sendMessage);
            
            // 初始化发送人类输入按钮事件
            document.getElementById('sendHumanInput').addEventListener('click', sendHumanInput);
            
            // 为讨论组导出按钮添加事件监听
            // document.getElementById('exportGroupChatBtn').addEventListener('click', exportGroupDiscussion);
            
            // 为用户消息输入框添加Enter键发送功能
            document.getElementById('userMessage').addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // 为人类角色输入框添加Enter键发送功能
            const humanInputMsg = document.getElementById('humanInputMessage');
            if (humanInputMsg) {
                // 移除现有的事件监听器
                if (humanInputMsg._keydownListener) {
                    humanInputMsg.removeEventListener('keydown', humanInputMsg._keydownListener);
                }
                
                // 创建新的事件监听器并保存引用
                humanInputMsg._keydownListener = function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        sendHumanInput();
                        isWaitingForHumanInput = false;
                        waitingForHumanName = null;
                    }
                };
                
                // 添加新的事件监听器
                humanInputMsg.addEventListener('keydown', humanInputMsg._keydownListener);
            }
            
            // 初始化高亮代码块
            highlightCodeBlocks();
            
            // 初始化代码块复制按钮
            setupCodeBlockCopyButtons();
            
            // 设置讨论组选择的事件监听器
            if (discussionGroupSelect) {
                discussionGroupSelect.addEventListener('change', function() {
                    // 更新当前选中的讨论组ID
                    currentGroupId = this.value;
                    // console.log('已选择讨论组:', currentGroupId);
                });
            }
            
            // 设置人类输入区域事件
            const humanSendButton = document.getElementById('sendHumanInput');
            if (humanSendButton) {
                humanSendButton.addEventListener('click', sendHumanInput);
            }
            
            const humanInputMessage = document.getElementById('humanInputMessage');
            if (humanInputMessage) {
                // 移除现有的事件监听器
                if (humanInputMessage._keydownListener) {
                    humanInputMessage.removeEventListener('keydown', humanInputMessage._keydownListener);
                }
                
                // 创建新的事件监听器并保存引用
                humanInputMessage._keydownListener = function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        sendHumanInput();
                        isWaitingForHumanInput = false;
                        waitingForHumanName = null;
                    }
                };
                
                // 添加新的事件监听器
                humanInputMessage.addEventListener('keydown', humanInputMessage._keydownListener);
            }
            
            // 设置重置按钮
            const resetButton = document.getElementById('resetButton');
            if (resetButton) {
                resetButton.addEventListener('click', resetChat);
            }
            
            // 隐藏加载提示
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            // 设置定时器检查人类输入状态
            window.humanInputProcessed = false; // 初始化人类输入处理标记
            setInterval(checkForHumanInput, 3000); // 每3秒检查一次
            
            // 不再需要全局导出按钮
            const oldExportButton = document.getElementById('exportMarkdown');
            if (oldExportButton) {
                oldExportButton.remove(); // 移除旧的导出按钮
            }
            
            // console.log('初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            showError('初始化失败: ' + error.message);
        }
    }
    
    // 处理聊天模式切换
    function handleChatModeChange(e) {
        const mode = e.target.value;
        setActiveChatMode(mode);
    }
    
    // 设置活动的聊天模式
    function setActiveChatMode(mode) {
        // 隐藏所有设置区域
        document.querySelectorAll('.chat-setting-section').forEach(el => {
            el.classList.add('d-none');
        });
        
        // 映射模式到正确的设置区域ID
        let settingSectionId = '';
        switch(mode) {
            case 'single':
                settingSectionId = 'single-model-settings';
                break;
            case 'relay':
                settingSectionId = 'relay-chain-settings';
                break;
            case 'role':
                settingSectionId = 'role-chat-settings';
                break;
            case 'group':
                settingSectionId = 'discussion-group-settings';
                
                // 确保讨论组ID与选择器同步
                const discussionGroupSelect = document.getElementById('discussionGroupSelect');
                if (discussionGroupSelect && discussionGroupSelect.value) {
                    currentGroupId = discussionGroupSelect.value;
                    // console.log('切换到讨论组模式，当前讨论组ID:', currentGroupId);
                }
                break;
            default:
                settingSectionId = 'single-model-settings';
        }
        // 控制讨论组导出按钮的显示与隐藏
        const discussionExportWrapper = document.getElementById('discussion-export-wrapper');
        if (discussionExportWrapper) {
            if (mode === 'group') {
                discussionExportWrapper.classList.remove('d-none');
            } else {
                discussionExportWrapper.classList.add('d-none');
            }
        }
        
        // 显示选择的设置区域
        const settingSection = document.getElementById(settingSectionId);
        if (settingSection) {
            settingSection.classList.remove('d-none');
            // console.log('显示设置区域:', settingSectionId);
        } else {
            console.error('未找到设置区域:', settingSectionId);
        }
        
        // 重置讨论历史
        resetChat();
        
        // 处理讨论组模式的特殊UI
        const normalChatInput = document.getElementById('normalChatInput');
        const discussionTopicInput = document.getElementById('discussionTopicInput');
        
        if (mode === 'group') {
            // 讨论组模式: 隐藏普通输入，显示主题输入
            if (normalChatInput) normalChatInput.classList.add('d-none');
            if (discussionTopicInput) discussionTopicInput.classList.remove('d-none');
            
            // 切换发送按钮事件
            const startDiscussionBtn = document.getElementById('startDiscussionBtn');
            if (startDiscussionBtn) {
                startDiscussionBtn.onclick = function() {
                    const topicInput = document.getElementById('discussionTopicMessage');
                    const groupSelect = document.getElementById('discussionGroupSelect');
                    
                    if (groupSelect && groupSelect.value && topicInput && topicInput.value && topicInput.value.trim()) {
                        const topicText = topicInput.value.trim();
                        handleGroupChat(topicText);
                        // 清除讨论主题输入框
                        topicInput.value = '';
                        // 隐藏讨论输入界面
                        if (discussionTopicInput) discussionTopicInput.classList.add('d-none');
                    } else {
                        let errorMsg = '创建讨论失败: ';
                        if (!groupSelect || !groupSelect.value) {
                            errorMsg += '请选择讨论组';
                        } else if (!topicInput || !topicInput.value || !topicInput.value.trim()) {
                            errorMsg += '请输入讨论主题';
                        }
                        showError(errorMsg);
                    }
                };
            }
        } else {
            // 其他模式: 显示普通输入，隐藏主题输入
            if (normalChatInput) normalChatInput.classList.remove('d-none');
            if (discussionTopicInput) discussionTopicInput.classList.add('d-none');
        }
        
        // 更新当前模式
        currentChatMode = mode;
    }
    
    // 加载模型列表
    async function loadModels() {
        try {
            const response = await fetch('/v1/model_configs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 保存模型信息到全局变量
            window.modelConfigs = {};
            data.forEach(model => {
                window.modelConfigs[model.id] = model;
            });
            
            // 填充单模型选择器
            if (singleModelSelect) {
                let options = '';
                data.forEach(model => {
                    // 标记reasoning类型模型
                    const modelType = model.type === 'reasoning' ? ' (思考型)' : '';
                    options += `<option value="${model.id}" data-type="${model.type || 'standard'}">${model.name}${modelType}</option>`;
                });
                
                singleModelSelect.innerHTML = options;
                
                // 设置默认值
                if (data.length > 0) {
                    currentModelId = data[0].id;
                }
            }
        } catch (error) {
            console.error('加载模型失败:', error);
        }
    }
    
    // 加载接力链配置
    async function loadConfigurations() {
        try {
            const response = await fetch('/v1/configurations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 填充接力链选择器
            if (relayChainSelect) {
                let options = '';
                data.forEach(config => {
                    options += `<option value="${config.id}">${config.name}</option>`;
                });
                
                relayChainSelect.innerHTML = options;
                
                // 设置默认值
                if (data.length > 0) {
                    currentRelayId = data[0].id;
                }
            }
        } catch (error) {
            console.error('加载接力链失败:', error);
        }
    }
    
    // 加载角色列表
    async function loadRoles() {
        try {
            const response = await fetch('/api/meeting/roles');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 填充角色选择器
            if (roleChatSelect) {
                let options = '';
                data.forEach(role => {
                    options += `<option value="${role.id}">${role.name}</option>`;
                });
                
                roleChatSelect.innerHTML = options;
                
                // 设置默认值
                if (data.length > 0) {
                    currentRoleId = data[0].id;
                }
            }
        } catch (error) {
            console.error('加载角色失败:', error);
        }
    }
    
    // 加载讨论组列表
    async function loadGroups() {
        try {
            const response = await fetch('/api/meeting/groups');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 填充讨论组选择器
            if (discussionGroupSelect) {
                let options = '';
                data.forEach(group => {
                    options += `<option value="${group.id}">${group.name}</option>`;
                });
                
                discussionGroupSelect.innerHTML = options;
                
                // 设置默认值
                if (data.length > 0) {
                    currentGroupId = data[0].id;
                    // 确保选择器实际显示选中的值
                    discussionGroupSelect.value = currentGroupId;
                    // console.log('初始讨论组设置为:', currentGroupId);
                }
            }
        } catch (error) {
            console.error('加载讨论组失败:', error);
        }
    }
    
    // 发送消息
    async function sendMessage() {
        const message = userMessage.value.trim();
        if (!message) return;
        
        // 显示加载状态
        showLoading();
        
        // 添加用户消息到聊天区域
        addMessageToChat('user', message);
        userMessage.value = '';
        
        // 根据当前模式处理消息
        try {
            switch (currentChatMode) {
                case 'single':
                    await handleSingleModelChat(message);
                    break;
                case 'relay':
                    await handleRelayChainChat(message);
                    break;
                case 'role':
                    await handleRoleChat(message);
                    break;
                case 'group':
                    await handleGroupChat(message);
                    break;
            }
        } catch (error) {
            console.error('发送消息失败:', error);
            addMessageToChat('system', '发送消息失败: ' + error.message);
        } finally {
            // 隐藏加载状态
            hideLoading();
        }
    }
    
    // 处理单模型对话
    async function handleSingleModelChat(message) {
        const modelId = singleModelSelect.value;
        
        // 检查模型类型
        const modelConfig = window.modelConfigs?.[modelId] || {};
        const isReasoningModel = modelConfig.type === 'reasoning';
        
        // 构建消息历史
        const messages = buildChatMessages(message);
        
        // 获取API密钥 - 使用默认或从localStorage获取
        const apiKey = getCurrentApiKey();
        
        try {
            // 使用流式响应处理
            const response = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}` // 添加API密钥到请求头
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true // 默认启用流式响应
                })
            });
            
            // 处理响应状态
            if (!response.ok) {
                // 当状态码不是2xx时
                if (response.status === 401) {
                    throw new Error('API密钥无效或未提供，请检查您的API密钥设置');
                } else {
                    throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
                }
            }
            
            // 创建消息容器
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container', 'ai');
            
            // 创建思考内容容器（初始为折叠状态）
            const thinkingContainer = document.createElement('div');
            thinkingContainer.classList.add('thinking-container');
            
            // 只有reasoning类型模型才显示思考过程
            if (!isReasoningModel) {
                thinkingContainer.style.display = 'none';
            }
            
            const thinkingHeader = document.createElement('div');
            thinkingHeader.classList.add('thinking-header');
            thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
            
            const thinkingContent = document.createElement('div');
            thinkingContent.classList.add('thinking-content');
            
            // 默认折叠
            thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
            thinkingContent.classList.add('collapsed');
            
            // 添加切换折叠功能
            thinkingHeader.addEventListener('click', () => {
                const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                icon.classList.toggle('collapsed');
                thinkingContent.classList.toggle('collapsed');
            });
            
            thinkingContainer.appendChild(thinkingHeader);
            thinkingContainer.appendChild(thinkingContent);
            
            // 创建常规消息内容容器
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            // 先添加思考容器，后添加内容容器（思考在上，回答在下）
            messageContainer.appendChild(thinkingContainer);
            messageContainer.appendChild(messageContent);
            chatMessages.appendChild(messageContainer);
            
            // 滚动到底部
            scrollToBottom();
            
            // 保存完整响应内容
            let fullContent = '';
            let thinkingContentText = '';
            let hasThinkingContent = false;
            
            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                // 解码并处理数据块
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                                const delta = data.choices[0].delta;
                                
                                // 处理普通内容
                                if (delta.content) {
                                    fullContent += delta.content;
                                    messageContent.innerHTML = marked.parse(fullContent);
                                    // 主动 typeset 并打标记，防止 observer 再次重复渲染
                                    // // console.log('messageContent', messageContent);
                                    processMathJax(messageContent);
                                }
                                
                                // 处理思考内容，但只在reasoning模型中显示
                                if (delta.reasoning_content || delta.hasOwnProperty('reasoning_content')) {
                                    hasThinkingContent = true;
                                    thinkingContentText += delta.reasoning_content || '';
                                    
                                    // 使用自定义函数更安全地更新思考内容而不破坏正在进行的渲染
                                    updateThinkingContent(thinkingContent, thinkingContentText);
                                    
                                    // 如果有思考内容且是reasoning模型，显示思考容器
                                    if (isReasoningModel) {
                                        thinkingContainer.style.display = 'block';
                                    }
                                }
                                
                                // 滚动到底部
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('解析流式响应失败:', e);
                        }
                    }
                }
            }
            
            // 如果没有思考内容，隐藏思考容器
            if (!hasThinkingContent || !isReasoningModel) {
                thinkingContainer.style.display = 'none';
            }
            
            // 添加导出按钮到AI消息
            addExportButtonToMessage(messageContainer);
            
            // 更新消息历史
            messageHistory.push({ role: 'user', content: message });
            messageHistory.push({ 
                role: 'assistant', 
                content: fullContent,
                reasoning_content: hasThinkingContent ? thinkingContentText : '' 
            });
            
            return fullContent;
        } catch (error) {
            console.error('流式请求失败，回退到普通请求:', error);
            
            // 回退到非流式请求
            const fallbackResponse = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                })
            });
            
            if (!fallbackResponse.ok) {
                if (fallbackResponse.status === 401) {
                    throw new Error('API密钥无效或未提供，请检查您的API密钥设置');
                } else {
                    throw new Error(`服务器错误: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
                }
            }
            
            const data = await fallbackResponse.json();
            
            if (data.choices && data.choices.length > 0) {
                const aiMessage = data.choices[0].message.content;
                const reasoningContent = data.choices[0].message.reasoning_content;
                
                // 添加带思考内容的消息
                const messageId = addMessageToChat('ai', aiMessage);
                
                // 如果有思考内容，添加思考容器
                if (reasoningContent) {
                    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
                    if (messageElement) {
                        // 清空现有内容以便重新排序
                        messageElement.innerHTML = '';
                        
                        // 创建思考容器
                        const thinkingContainer = document.createElement('div');
                        thinkingContainer.classList.add('thinking-container');
                        
                        const thinkingHeader = document.createElement('div');
                        thinkingHeader.classList.add('thinking-header');
                        thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
                        
                        const thinkingContent = document.createElement('div');
                        thinkingContent.classList.add('thinking-content');
                        
                        // 使用安全的方式更新思考内容
                        updateThinkingContent(thinkingContent, reasoningContent);
                        
                        // 默认折叠
                        thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
                        thinkingContent.classList.add('collapsed');
                        
                        // 添加切换折叠功能
                        thinkingHeader.addEventListener('click', () => {
                            const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                            icon.classList.toggle('collapsed');
                            thinkingContent.classList.toggle('collapsed');
                        });
                        
                        // 创建常规内容容器
                        const messageContent = document.createElement('div');
                        messageContent.classList.add('message-content');
                        messageContent.innerHTML = marked.parse(aiMessage);
                        processMathJax(messageContent);
                        
                        // 先添加思考再添加内容（思考在上，回答在下）
                        thinkingContainer.appendChild(thinkingHeader);
                        thinkingContainer.appendChild(thinkingContent);
                        messageElement.appendChild(thinkingContainer);
                        messageElement.appendChild(messageContent);
                        
                        // 添加导出按钮
                        addExportButtonToMessage(messageElement);
                    }
                }
                
                // 更新消息历史
                messageHistory.push({ role: 'user', content: message });
                messageHistory.push({ 
                    role: 'assistant', 
                    content: aiMessage,
                    reasoning_content: reasoningContent || ''
                });
                
                return aiMessage;
            } else {
                throw new Error('未收到有效响应');
            }
        }
    }
    
    // 处理接力链对话
    async function handleRelayChainChat(message) {
        const configId = relayChainSelect.value;
        // 初始化extractedMeetingId变量
        let extractedMeetingId = null;
        
        // 构建消息历史
        const messages = buildChatMessages(message);
        
        // 获取API密钥 - 使用默认或从localStorage获取
        const apiKey = getCurrentApiKey();
        
        try {
            // 获取配置详情以提取配置名称
            const configResponse = await fetch(`/v1/configurations/${configId}`);
            let configName = configId;  // 默认使用ID
            
            if (configResponse.ok) {
                const configData = await configResponse.json();
                configName = configData.name;  // 使用配置名称
                // console.log(`使用配置名称发送请求: ${configName}`);
            } else {
                console.warn(`无法获取配置信息，将使用配置ID: ${configId}`);
            }
            
            // 使用流式响应处理
            const response = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}` // 添加API密钥到请求头
                },
                body: JSON.stringify({
                    model: configName,  // 使用配置名称而不是ID
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true // 默认启用流式响应
                })
            });
            
            // 处理响应状态
            if (!response.ok) {
                // 当状态码不是2xx时
                if (response.status === 401) {
                    throw new Error('API密钥无效或未提供，请检查您的API密钥设置');
                } else {
                    throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
                }
            }
            
            // 创建初始消息容器（如果没有特定发言人，将使用此容器）
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container', 'ai');
            
            // 为AI消息添加导出按钮
            addExportButtonToMessage(messageContainer);
            
            // 创建思考内容容器（初始为折叠状态）
            const thinkingContainer = document.createElement('div');
            thinkingContainer.classList.add('thinking-container');
            thinkingContainer.style.display = 'none'; // 默认隐藏
            
            const thinkingHeader = document.createElement('div');
            thinkingHeader.classList.add('thinking-header');
            thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
            
            const thinkingContent = document.createElement('div');
            thinkingContent.classList.add('thinking-content');
            
            // 默认折叠
            thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
            thinkingContent.classList.add('collapsed');
            
            // 添加切换折叠功能
            thinkingHeader.addEventListener('click', () => {
                const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                icon.classList.toggle('collapsed');
                thinkingContent.classList.toggle('collapsed');
            });
            
            thinkingContainer.appendChild(thinkingHeader);
            thinkingContainer.appendChild(thinkingContent);
            
            // 创建常规消息内容容器
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            // 先添加思考容器再添加常规内容容器
            messageContainer.appendChild(thinkingContainer);
            messageContainer.appendChild(messageContent);
            chatMessages.appendChild(messageContainer);
            
            // 滚动到底部
            scrollToBottom();
            
            // 保存完整响应内容
            let fullContent = '';
            let thinkingContentText = '';
            let hasThinkingContent = false;
            
            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let currentSpeaker = null;
            let speakerContent = '';
            let speakerThinkingContent = '';
            let speakerContainer = null;
            let speakerContentElement = null;
            let speakerThinkingContainer = null;
            
            let hasSpecialFormat = false; // 跟踪是否检测到特殊格式（发言人格式或其他特殊标记）
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            // 解析SSE数据
                            const data = JSON.parse(line.substring(6));
                            
                            // 检查是否有内容更新
                            if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                                const delta = data.choices[0].delta;
                                const content = delta.content || '';
                                const reasoningContent = delta.reasoning_content || '';
                                
                                // 处理思考内容
                                if (reasoningContent && !content) {
                                    hasThinkingContent = true;
                                    
                                    if (currentSpeaker) {
                                        // 处理特定发言人的思考内容
                                        speakerThinkingContent += reasoningContent;
                                        
                                        // 更新思考内容
                                        if (speakerThinkingContainer) {
                                            // 显示思考容器
                                            speakerThinkingContainer.style.display = 'block';
                                            
                                            const thinkingContentElement = speakerThinkingContainer.querySelector('.thinking-content');
                                            if (thinkingContentElement) {
                                                thinkingContentElement.innerHTML = marked.parse(speakerThinkingContent);
                                                processMathJax(thinkingContentElement);
                                            }
                                        }
                                    } else {
                                        // 处理通用思考内容
                                        thinkingContentText += reasoningContent;
                                        thinkingContent.innerHTML = marked.parse(thinkingContentText);
                                        processMathJax(thinkingContent);
                                        // 显示思考容器
                                        thinkingContainer.style.display = 'block';
                                    }
                                }
                                // 处理其他类型的响应...
                                else {
                                    // 处理常规内容更新、总结内容等现有逻辑
                                    if (content) {
                                        if (currentSpeaker) {
                                            speakerContent += content;
                                            if (speakerContentElement) {
                                                speakerContentElement.innerHTML = marked.parse(speakerContent);
                                                processMathJax(speakerContentElement);
                                            }
                                        } else {
                                            fullContent += content;
                                            messageContent.innerHTML = marked.parse(fullContent);
                                            processMathJax(messageContent);
                                        }
                                    }
                                }
                                
                                // 滚动到底部
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('解析流式响应失败:', e);
                        }
                    } else if (line === 'data: [DONE]') {
                        // console.log('讨论完成');
                        
                        // 清理定时刷新
                        if (window.refreshTimer) {
                            clearTimeout(window.refreshTimer);
                            window.refreshTimer = null;
                            // console.log("已清理会议刷新定时器");
                        }
                        
                        // 流结束后，检查一次是否需要人类输入
                        await checkForHumanInput();
                    }
                }
            }
            
            // 隐藏加载状态
            hideLoading();
            
            return true;
        } catch (error) {
            console.error('创建讨论失败:', error);
            hideLoading();
            showError(`创建讨论失败: ${error.message}`);
            return false;
        }
    }
    
    // 处理角色对话
    async function handleRoleChat(message) {
        const roleId = roleChatSelect.value;
        
        // 获取API密钥 - 使用默认或从localStorage获取
        const apiKey = getCurrentApiKey();
        
        try {
            // 使用流式响应处理
            const response = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}` // 添加API密钥到请求头
                },
                body: JSON.stringify({
                    model: `role-${roleId}`,
                    messages: [...messageHistory, { role: 'user', content: message }],
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true // 默认启用流式响应
                })
            });
            
            // 处理响应状态
            if (!response.ok) {
                // 当状态码不是2xx时
                if (response.status === 401) {
                    throw new Error('API密钥无效或未提供，请检查您的API密钥设置');
                } else {
                    throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
                }
            }
            
            // 创建消息容器
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container', 'ai');
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            messageContainer.appendChild(messageContent);
            chatMessages.appendChild(messageContainer);
            
            // 为AI消息添加导出按钮
            addExportButtonToMessage(messageContainer);
            
            // 创建思考内容容器（初始为折叠状态）
            const thinkingContainer = document.createElement('div');
            thinkingContainer.classList.add('thinking-container');
            
            const thinkingHeader = document.createElement('div');
            thinkingHeader.classList.add('thinking-header');
            thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
            
            const thinkingContent = document.createElement('div');
            thinkingContent.classList.add('thinking-content');
            
            // 默认折叠
            thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
            thinkingContent.classList.add('collapsed');
            
            // 添加切换折叠功能
            thinkingHeader.addEventListener('click', () => {
                const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                icon.classList.toggle('collapsed');
                thinkingContent.classList.toggle('collapsed');
            });
            
            thinkingContainer.appendChild(thinkingHeader);
            thinkingContainer.appendChild(thinkingContent);
            
            // 滚动到底部
            scrollToBottom();
            
            // 保存完整响应内容
            let fullContent = '';
            let thinkingContentText = '';
            let hasThinkingContent = false;
            
            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                // 解码并处理数据块
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                                const delta = data.choices[0].delta;
                                
                                // 处理普通内容
                                if (delta.content) {
                                    fullContent += delta.content;
                                    messageContent.innerHTML = marked.parse(fullContent);
                                    processMathJax(messageContent);
                                    
                                }
                                
                                // 处理思考内容
                                if (delta.reasoning_content || delta.hasOwnProperty('reasoning_content')) {
                                    hasThinkingContent = true;
                                    thinkingContentText += delta.reasoning_content || '';
                                    thinkingContent.innerHTML = marked.parse(thinkingContentText);
                                    processMathJax(thinkingContent);
                                    
                                    // 如果是第一次出现思考内容，添加思考容器到DOM
                                    if (!messageContainer.contains(thinkingContainer)) {
                                        messageContainer.appendChild(thinkingContainer);
                                    }
                                }
                                
                                // 滚动到底部
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('解析流式响应失败:', e);
                        }
                    }
                }
            }
            
            // 如果没有思考内容，移除思考容器
            if (!hasThinkingContent && messageContainer.contains(thinkingContainer)) {
                messageContainer.removeChild(thinkingContainer);
            }
            
            // 更新消息历史
            messageHistory.push({ role: 'user', content: message });
            messageHistory.push({ 
                role: 'assistant', 
                content: fullContent,
                reasoning_content: hasThinkingContent ? thinkingContentText : '' 
            });
            
            return fullContent;
        } catch (error) {
            console.error('流式请求失败，回退到普通请求:', error);
            
            // 回退到非流式请求
            const fallbackResponse = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}`
                },
                body: JSON.stringify({
                    model: `role-${roleId}`,
                    messages: [...messageHistory, { role: 'user', content: message }],
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                })
            });
            
            if (!fallbackResponse.ok) {
                if (fallbackResponse.status === 401) {
                    throw new Error('API密钥无效或未提供，请检查您的API密钥设置');
                } else {
                    throw new Error(`服务器错误: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
                }
            }
            
            const data = await fallbackResponse.json();
            
            if (data.choices && data.choices.length > 0) {
                const aiMessage = data.choices[0].message.content;
                const reasoningContent = data.choices[0].message.reasoning_content;
                
                // 添加带思考内容的消息
                const messageId = addMessageToChat('ai', aiMessage);
                
                // 如果有思考内容，添加思考容器
                if (reasoningContent) {
                    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
                    if (messageElement) {
                        // 清空现有内容以便重新排序
                        messageElement.innerHTML = '';
                        
                        // 创建思考容器
                        const thinkingContainer = document.createElement('div');
                        thinkingContainer.classList.add('thinking-container');
                        
                        const thinkingHeader = document.createElement('div');
                        thinkingHeader.classList.add('thinking-header');
                        thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
                        
                        const thinkingContent = document.createElement('div');
                        thinkingContent.classList.add('thinking-content');
                        
                        // 使用安全的方式更新思考内容
                        updateThinkingContent(thinkingContent, reasoningContent);
                        
                        // 默认折叠
                        thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
                        thinkingContent.classList.add('collapsed');
                        
                        // 添加切换折叠功能
                        thinkingHeader.addEventListener('click', () => {
                            const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                            icon.classList.toggle('collapsed');
                            thinkingContent.classList.toggle('collapsed');
                        });
                        
                        // 创建常规内容容器
                        const messageContent = document.createElement('div');
                        messageContent.classList.add('message-content');
                        messageContent.innerHTML = marked.parse(aiMessage);
                        processMathJax(messageContent);
                        
                        // 先添加思考再添加内容（思考在上，回答在下）
                        thinkingContainer.appendChild(thinkingHeader);
                        thinkingContainer.appendChild(thinkingContent);
                        messageElement.appendChild(thinkingContainer);
                        messageElement.appendChild(messageContent);
                        
                        // 添加导出按钮
                        addExportButtonToMessage(messageElement);
                    }
                }
                
                // 更新消息历史
                messageHistory.push({ role: 'user', content: message });
                messageHistory.push({ 
                    role: 'assistant', 
                    content: aiMessage,
                    reasoning_content: reasoningContent || ''
                });
                
                return aiMessage;
            } else {
                throw new Error('未收到有效响应');
            }
        }
    }
    
    // 处理讨论组对话
    async function handleGroupChat(message) {
        try {
            // 记录当前使用的讨论组ID
            // console.log('开始讨论组对话，当前选中的讨论组ID:', currentGroupId);
            // console.log('讨论组选择器当前值:', discussionGroupSelect.value);
    
            // 确保讨论组ID与选择器一致
            if (currentGroupId !== discussionGroupSelect.value) {
                // console.log('检测到讨论组ID不一致，更新为当前选择的值');
                currentGroupId = discussionGroupSelect.value;
            }
    
            if (!currentGroupId) {
                showError('请先选择讨论组');
                return false;
            }
    
            if (!message || !message.trim()) {
                showError('请输入讨论主题');
                return false;
            }
    
            // 显示加载状态
            showLoading();
    
            // 获取API密钥
            const apiKey = getCurrentApiKey();
    
            // 清空消息区域
            chatMessages.innerHTML = '';
    
            // 添加主题头部
            const topicEl = document.createElement('div');
            topicEl.classList.add('discussion-topic');
            topicEl.innerHTML = `<h3>讨论主题: ${message.trim()}</h3>`;
            chatMessages.appendChild(topicEl);
    
            // 使用OpenAI兼容API进行流式请求
            const response = await fetch('/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}`
                },
                body: JSON.stringify({
                    model: `group-${currentGroupId}`,
                    messages: [{ role: 'user', content: message.trim() }],
                    stream: true
                })
            });
    
            if (!response.ok) {
                throw new Error(`讨论创建失败: ${response.status} ${response.statusText}`);
            }
    
            // 获取会议ID - 从响应头中提取
            const meetingIdHeader = response.headers.get('X-Meeting-Id');
            if (meetingIdHeader) {
                currentMeetingId = meetingIdHeader;
                // console.log("从响应头获取到会议ID:", currentMeetingId);
    
                // 加载该会议中的人类角色
                await loadHumanRoles();
            }
    
            // 处理SSE流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
    
            let currentSpeaker = null;
            let speakerContent = '';
            let speakerThinkingContent = '';
            let speakerContainer = null;
            let speakerContentElement = null;
            let speakerThinkingContainer = null;
    
            let hasSpecialFormat = false; // 跟踪是否检测到特殊格式
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // 如果流结束，检查会议是否已结束
                    // console.log("流结束，检查会议状态");
                    if (currentMeetingId) {
                        try {
                            const statusResponse = await fetch(`/api/meeting/discussions/${currentMeetingId}/messages`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `${apiKey}`
                                }
                            });
    
                            if (statusResponse.ok) {
                                const statusData = await statusResponse.json();
                                if (statusData.status === "已结束") {
                                    // console.log("检测到会议已结束，取消定时刷新");
                                    if (window.refreshTimer) {
                                        clearTimeout(window.refreshTimer);
                                        window.refreshTimer = null;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("检查会议状态出错:", e);
                        }
                    }
                    break;
                }
    
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
    
                for (const line of lines) {
                    // 从第一个数据块中提取会议ID（如果响应头中没有）
                    if (!currentMeetingId && line.includes("meeting_id")) {
                        try {
                            const match = line.match(/"meeting_id":\s*"([^"]+)"/);
                            if (match && match[1]) {
                                currentMeetingId = match[1];
                                // console.log("从响应内容中提取到会议ID:", currentMeetingId);
    
                                // 加载该会议中的人类角色
                                await loadHumanRoles();
                            }
                        } catch (e) {
                            console.error("提取会议ID时出错:", e);
                        }
                    }
    
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            // 解析SSE数据
                            const data = JSON.parse(line.substring(6));
    
                            // 检查是否有内容更新
                            if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                                const delta = data.choices[0].delta;
                                const content = delta.content || '';
                                const reasoningContent = delta.reasoning_content || '';
    
                                // 检查是否有新发言人标记 "### 名称 发言："
                                const speakerMatch = content.match(/###\s+(.+?)\s+发言：/);
    
                                if (speakerMatch) {
                                    hasSpecialFormat = true; // 标记检测到特殊格式
    
                                    // 如果有之前的发言者，保存之前的内容
                                    if (currentSpeaker && speakerContent.trim()) {
                                        // 添加内容到UI
                                        if (speakerContentElement) {
                                            speakerContentElement.innerHTML = marked.parse(speakerContent);
                                            processMathJax(speakerContentElement);
                                        }
                                    }
    
                                    // 新发言人开始
                                    currentSpeaker = speakerMatch[1];
                                    speakerContent = '';
                                    speakerThinkingContent = '';
    
                                    // 检查是否是人类角色
                                    const isHumanRole = humanRoles.some(role => role.name === currentSpeaker);
    
                                    if (isHumanRole) {
                                        // console.log(`检测到人类角色 ${currentSpeaker} 即将发言`);
                                        // 统一调用 showWaitingForHumanInput
                                        showWaitingForHumanInput(currentSpeaker);
    
                                        // 创建新的发言容器，但隐藏不显示
                                        speakerContainer = document.createElement('div');
                                        speakerContainer.classList.add('agent-message', 'human-message', 'waiting-human', 'd-none');
    
                                        const speakerHeader = document.createElement('div');
                                        speakerHeader.classList.add('agent-header');
    
                                        const speakerNameElement = document.createElement('div');
                                        speakerNameElement.classList.add('agent-name');
                                        speakerNameElement.textContent = currentSpeaker;
    
                                        const speakerBadge = document.createElement('div');
                                        speakerBadge.classList.add('agent-badge', 'human-badge');
                                        speakerBadge.textContent = '人类';
    
                                        speakerHeader.appendChild(speakerNameElement);
                                        speakerHeader.appendChild(speakerBadge);
    
                                        speakerContentElement = document.createElement('div');
                                        speakerContentElement.classList.add('agent-content');
                                        speakerContentElement.textContent = "等待人类输入...";
    
                                        speakerContainer.appendChild(speakerHeader);
                                        speakerContainer.appendChild(speakerContentElement);
    
                                        chatMessages.appendChild(speakerContainer);
    
                                        // 检查人类输入（如果有额外逻辑）
                                        await checkForHumanInput();
                                    } else {
                                        // 创建新的发言容器
                                        speakerContainer = document.createElement('div');
                                        speakerContainer.classList.add('agent-message');
                                        speakerContainer.style.display = 'flex';
                                        speakerContainer.style.flexDirection = 'column';
    
                                        const speakerHeader = document.createElement('div');
                                        speakerHeader.classList.add('agent-header');
    
                                        const speakerNameElement = document.createElement('div');
                                        speakerNameElement.classList.add('agent-name');
                                        speakerNameElement.textContent = currentSpeaker;
    
                                        const speakerBadge = document.createElement('div');
                                        speakerBadge.classList.add('agent-badge');
                                        speakerBadge.textContent = 'AI';
    
                                        speakerHeader.appendChild(speakerNameElement);
                                        speakerHeader.appendChild(speakerBadge);
    
                                        // 创建思考内容容器（先创建）
                                        speakerThinkingContainer = document.createElement('div');
                                        speakerThinkingContainer.classList.add('thinking-container');
                                        speakerThinkingContainer.style.display = 'none'; // 默认隐藏
                                        speakerThinkingContainer.style.width = '100%';
    
                                        const thinkingHeader = document.createElement('div');
                                        thinkingHeader.classList.add('thinking-header');
                                        thinkingHeader.innerHTML = '<span class="thinking-toggle-icon">▼</span>查看思考过程';
    
                                        const thinkingContent = document.createElement('div');
                                        thinkingContent.classList.add('thinking-content');
    
                                        // 默认折叠
                                        thinkingHeader.querySelector('.thinking-toggle-icon').classList.add('collapsed');
                                        thinkingContent.classList.add('collapsed');
    
                                        // 添加切换折叠功能
                                        thinkingHeader.addEventListener('click', () => {
                                            const icon = thinkingHeader.querySelector('.thinking-toggle-icon');
                                            icon.classList.toggle('collapsed');
                                            thinkingContent.classList.toggle('collapsed');
                                        });
    
                                        speakerThinkingContainer.appendChild(thinkingHeader);
                                        speakerThinkingContainer.appendChild(thinkingContent);
    
                                        // 创建内容元素（后创建）
                                        speakerContentElement = document.createElement('div');
                                        speakerContentElement.classList.add('agent-content');
                                        speakerContentElement.style.width = '100%';
    
                                        // 先添加思考容器再添加内容（思考在上，回答在下）
                                        speakerContainer.appendChild(speakerHeader);
                                        speakerContainer.appendChild(speakerThinkingContainer);
                                        speakerContainer.appendChild(speakerContentElement);
    
                                        chatMessages.appendChild(speakerContainer);
                                    }
                                }
                                // 检查是否有会议结束和总结标记
                                else if (content.includes("## 会议结束") || content.includes("会议总结") || content.includes("## 会议总结")) {
                                    hasSpecialFormat = true; // 标记检测到特殊格式
    
                                    // console.log("检测到会议结束或总结标记: ", content);
    
                                    // 如果有之前的发言者，保存之前的内容
                                    if (currentSpeaker && speakerContent.trim()) {
                                        // 添加内容到UI
                                        if (speakerContentElement) {
                                            speakerContentElement.innerHTML = marked.parse(speakerContent);
                                            processMathJax(speakerContentElement);
                                        }
                                    }
    
                                    // 创建总结发言人
                                    currentSpeaker = "总结";
                                    speakerContent = content;  // 先添加当前delta到内容中
    
                                    // 查找已经存在的总结消息
                                    const existingSummaries = document.querySelectorAll('.summary-message');
                                    if (existingSummaries.length > 0) {
                                        // 如果已经存在总结容器，使用它
                                        speakerContainer = existingSummaries[0];
                                        speakerContentElement = speakerContainer.querySelector('.agent-content');
                                        if (!speakerContentElement) {
                                            speakerContentElement = document.createElement('div');
                                            speakerContentElement.classList.add('agent-content');
                                            speakerContentElement.style.width = '100%';
                                            speakerContainer.appendChild(speakerContentElement);
                                        }
    
                                        insertExportButtonToSummary();
                                        // console.log("使用已存在的总结容器");
                                    } else {
                                        // 创建新的发言容器
                                        speakerContainer = document.createElement('div');
                                        speakerContainer.classList.add('agent-message', 'summary-message');
                                        speakerContainer.style.display = 'flex';
                                        speakerContainer.style.flexDirection = 'column';
    
                                        const speakerHeader = document.createElement('div');
                                        speakerHeader.classList.add('agent-header');
    
                                        const speakerNameElement = document.createElement('div');
                                        speakerNameElement.classList.add('agent-name');
                                        speakerNameElement.textContent = "会议总结";
    
                                        const speakerBadge = document.createElement('div');
                                        speakerBadge.classList.add('agent-badge');
                                        speakerBadge.textContent = 'AI';
    
                                        speakerHeader.appendChild(speakerNameElement);
                                        speakerHeader.appendChild(speakerBadge);
    
                                        speakerContentElement = document.createElement('div');
                                        speakerContentElement.classList.add('agent-content');
                                        speakerContentElement.style.width = '100%';
    
                                        speakerContainer.appendChild(speakerHeader);
                                        speakerContainer.appendChild(speakerContentElement);
    
                                        chatMessages.appendChild(speakerContainer);
    
                                        insertExportButtonToSummary();
    
                                        // console.log("创建了新的总结容器");
                                    }
    
                                    // 确保总结标题显示在顶部
                                    speakerContentElement.innerHTML = marked.parse(speakerContent);
                                    processMathJax(speakerContentElement);
                                    // 清除检查人类输入的定时器
                                    if (humanCheckInterval) {
                                        clearInterval(humanCheckInterval);
                                        humanCheckInterval = null;
                                    }
    
                                    // 设置会议为已结束状态
                                    if (currentMeetingId) {
                                        // console.log("会议已结束，清除会议ID");
                                        currentMeetingId = null;
                                    }
    
                                    // 滚动到底部
                                    scrollToBottom();
                                }
                                // 当已经在显示总结内容时，继续累积总结内容
                                else if (currentSpeaker === "总结") {
                                    // console.log("正在累积总结内容: " + content.substring(0, 30) + (content.length > 30 ? "..." : ""));
                                    speakerContent += content;
    
                                    // 更新总结内容
                                    if (speakerContentElement) {
                                        speakerContentElement.innerHTML = marked.parse(speakerContent);
                                        processMathJax(speakerContentElement);
                                        // 滚动到底部
                                        scrollToBottom();
                                    }
                                }
                                // 检查"等待人类输入"标记
                                else if (content.includes("等待人类输入") || content.includes("waiting for human input")) {
                                    hasSpecialFormat = true; // 标记检测到特殊格式
    
                                    // console.log("检测到等待人类输入的提示");
                                    // 统一调用 showWaitingForHumanInput
                                    showWaitingForHumanInput(currentSpeaker);
                                    // 立即检查人类输入状态
                                    await checkForHumanInput();
                                }
                                // 处理思考内容
                                else if (reasoningContent) {
                                    hasThinkingContent = true;
    
                                    if (currentSpeaker) {
                                        // 处理特定发言人的思考内容
                                        speakerThinkingContent += reasoningContent;
    
                                        // 更新思考内容
                                        if (speakerThinkingContainer) {
                                            // 显示思考容器
                                            speakerThinkingContainer.style.display = 'block';
    
                                            const thinkingContentElement = speakerThinkingContainer.querySelector('.thinking-content');
                                            if (thinkingContentElement) {
                                                thinkingContentElement.innerHTML = marked.parse(speakerThinkingContent);
                                                processMathJax(thinkingContentElement);
                                            }
                                        }
                                    } else {
                                        // 处理通用思考内容
                                        thinkingContentText += reasoningContent;
                                        thinkingContent.innerHTML = marked.parse(thinkingContentText);
                                        processMathJax(thinkingContent);
                                        // 显示思考容器
                                        thinkingContainer.style.display = 'block';
                                    }
                                }
                                // 处理其他类型的响应...
                                else {
                                    // 处理常规内容更新、总结内容等现有逻辑
                                    if (content) {
                                        if (currentSpeaker) {
                                            speakerContent += content;
                                            if (speakerContentElement) {
                                                speakerContentElement.innerHTML = marked.parse(speakerContent);
                                                processMathJax(speakerContentElement);
                                            }
                                        } 
                                    }
                                }
    
                                // 滚动到底部
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('解析流式响应失败:', e);
                        }
                    } else if (line === 'data: [DONE]') {
                        // console.log('讨论完成');
    
                        // 清理定时刷新
                        if (window.refreshTimer) {
                            clearTimeout(window.refreshTimer);
                            window.refreshTimer = null;
                            // console.log("已清理会议刷新定时器");
                        }
    
                        // 流结束后，检查一次是否需要人类输入
                        await checkForHumanInput();
                    }
                }
            }
    
            // 隐藏加载状态
            hideLoading();
    
            return true;
        } catch (error) {
            console.error('创建讨论失败:', error);
            hideLoading();
            showError(`创建讨论失败: ${error.message}`);
            return false;
        }
    }
    
    // 加载人类角色
    async function loadHumanRoles() {
        // 检查是否为讨论组模式
        const isDiscussionMode = currentChatMode === 'group';
        
        if (!currentMeetingId || !isDiscussionMode) return;
        
        // console.log('加载会议中的人类角色...');
        
        try {
            // 获取API密钥
            const apiKey = getCurrentApiKey();
            
            // 获取人类角色
            const response = await fetch(`/api/meeting/discussions/${currentMeetingId}/human_roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `${apiKey}`
                }
            });
            
            if (!response.ok) {
                console.error(`获取人类角色失败: ${response.status}`);
                return;
            }
            
            humanRoles = await response.json();
            
            // console.log('已加载人类角色:', humanRoles);
            
            return humanRoles;
        } catch (error) {
            console.error('加载人类角色失败:', error);
            return [];
        }
    }
    
    /**
     * 检查当前是否需要人类输入（在讨论组中）
     */
    async function checkForHumanInput() {
        // 如果刚刚处理过人类输入，重置标记并跳过本次检查
        if (window.humanInputProcessed) {
            // console.log('检测到人类输入刚刚被处理，跳过本次检查');
            window.humanInputProcessed = false;
            isWaitingForHumanInput = false;
            waitingForHumanName = null;
            return;
        }
        // 检查是否为讨论组模式
        const isDiscussionMode = currentChatMode === 'group';
        
        if (!currentMeetingId || !isDiscussionMode) return;
        if (isWaitingForHumanInput) return; // 已经在等待人类输入
        
        // console.log('检查是否需要人类输入');
        
        try {
            // 获取API密钥
            const apiKey = getCurrentApiKey();
            
            // 获取会议状态
            const response = await fetch(`/api/meeting/discussions/${currentMeetingId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `${apiKey}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // 会议不存在，重置会议ID
                    currentMeetingId = null;
                    // 清理定时刷新
                    if (window.refreshTimer) {
                        clearTimeout(window.refreshTimer);
                        window.refreshTimer = null;
                        // console.log("已清理会议刷新定时器");
                    }
                }
                console.error(`获取会议状态失败: ${response.status}`);
                return;
            }
            
            const data = await response.json();
            // console.log('会议状态:', data);
            
            // 如果会议已结束，不需要人类输入
            if (data.status === "已结束") {
                // console.log('会议已结束，不需要人类输入');
                // 清理定时刷新
                if (window.refreshTimer) {
                    clearTimeout(window.refreshTimer);
                    window.refreshTimer = null;
                    // console.log("检测到会议已结束，已清理会议刷新定时器");
                }
                return;
            }
            
            // 直接检查会议状态是否为"waiting_for_human"
            if (data.status === "waiting_for_human" && data.waiting_for_agent) {
                // 只有在等待角色是人类角色时才显示输入区域
                const isHumanRole = humanRoles && humanRoles.some(role => role.name === data.waiting_for_agent);
                
                if (isHumanRole) {
                    // console.log(`会议状态为waiting_for_human，等待角色: ${data.waiting_for_agent}`);
                    showHumanInputArea(data.waiting_for_agent);
                    return;
                } else {
                    // console.log(`会议等待的角色 ${data.waiting_for_agent} 不是人类角色，不显示输入区域`);
                }
            }
            
            
            // 从会议历史中检查是否需要人类输入
            const history = data.history || [];
            const lastMessages = history.slice(-5); // 获取最近5条消息
            
            // 检查是否加载过人类角色
            if (!humanRoles || !humanRoles.length) {
                await loadHumanRoles();
            }
            
            // 1. 检查最后一条消息是否是系统消息指示等待人类输入
            const lastMessage = history[history.length - 1];
            if (lastMessage && lastMessage.agent === "system") {
                const systemContent = lastMessage.content.toLowerCase();
                // 检查系统消息是否指示等待人类输入
                if (systemContent.includes("等待人类输入") || 
                    systemContent.includes("等待用户输入") ||
                    systemContent.includes("请输入")) {
                    
                    // 找到人类角色名称
                    const matchedRole = humanRoles.find(role => 
                        systemContent.includes(role.name.toLowerCase())
                    );
                    
                    if (matchedRole) {
                        showHumanInputArea(matchedRole.name);
                        // console.log(`需要人类${matchedRole.name}输入`);
                        return;
                    }
                }
            }
            
            // 2. 查找最近5条消息中是否有明确提到需要人类角色输入的内容
            for (const message of lastMessages) {
                const content = message.content.toLowerCase();
                
                // 检查每个人类角色是否被点名发言
                for (const role of humanRoles) {
                    const roleName = role.name.toLowerCase();
                    
                    // 检查是否有明确等待该角色输入的提示
                    if ((content.includes(`${roleName}请`) || 
                         content.includes(`请${roleName}`) ||
                         content.includes(`轮到${roleName}`) || 
                         content.includes(`该${roleName}发言`) ||
                         content.includes(`${roleName}的回合`) ||
                         content.includes(`等待${roleName}`) ||
                         content.includes(`需要${roleName}`)) &&
                        !content.includes(`${roleName}：`) && 
                        !content.includes(`${roleName}:`)
                       ) {
                        
                        showHumanInputArea(role.name);
                        // console.log(`需要人类${role.name}输入 (从消息中检测)`);
                        return;
                    }
                }
                
                
                
            }
            
            // 3. 分析会议状态中的特殊标记
            if (data.waiting_for_human_input) {
                const roleName = data.waiting_for_human_input;
                showHumanInputArea(roleName);
                // console.log(`会议状态显示需要人类${roleName}输入`);
                return;
            }
            
            // 4. 检查最近的发言顺序
            if (lastMessages.length >= 2) {
                // 分析最近的发言顺序，看是否该人类角色发言
                const recentSpeakers = lastMessages.map(msg => msg.agent);
                
                // 根据会议模式分析下一个发言者
                if (data.mode) {
                    const agents = data.agents || [];
                    const humanAgents = agents.filter(agent => 
                        humanRoles.some(role => role.name === agent.name)
                    );
                    
                    // 如果有人类角色且当前是他们的回合
                    for (const humanAgent of humanAgents) {
                        // 特定条件下显示人类输入区域
                        if (requiresHumanInputBasedOnPattern(recentSpeakers, humanAgent.name, data.mode)) {
                            showHumanInputArea(humanAgent.name);
                            // console.log(`根据发言模式分析，需要人类${humanAgent.name}输入`);
                            return;
                        }
                    }
                }
            }
            
            // console.log('未检测到需要人类输入');
            
        } catch (error) {
            console.error('检查人类输入需求失败:', error);
        }
    }
    
    // 根据发言模式分析是否需要人类输入
    function requiresHumanInputBasedOnPattern(speakers, humanName, mode) {
        
        
        return false;
    }
    
    // 显示人类输入区域
    function showHumanInputArea(roleName) {
        // 使用新的实现来避免覆盖前一个角色的内容
        showWaitingForHumanInput(roleName);
        
        // 由于历史兼容性原因，保留该函数，但实际实现委托给新函数
        // console.log(`等待人类角色"${roleName}"输入，会议暂停，使用委托方法`);
    }
    
    // 防止重复提交的标志
    let isSubmitting = false;
    
    // 发送人类输入
    async function sendHumanInput() {
        // 防止重复提交
        if (isSubmitting) {
            // console.log('已经在提交中，忽略重复请求');
            return;
        }
        
        // 设置提交标志
        isSubmitting = true;
        
        // 设置超时，确保即使出错也会重置标志
        setTimeout(() => {
            isSubmitting = false;
        }, 2000); // 2秒后重置
        // 获取DOM元素
        const humanInputMessage = document.getElementById('humanInputMessage');
        const humanInputSubmit = document.getElementById('sendHumanInput');
        const humanRoleName = document.getElementById('humanRoleName');
        const humanInputArea = document.getElementById('humanInputArea');
        
        // 获取输入的消息内容
        const messageText = humanInputMessage.value.trim();
        
        // 检查消息是否为空
        if (!messageText) {
            showError('请输入消息内容');
            return;
        }
        
        // 检查是否有会议ID，并确保会议状态有效
        if (!currentMeetingId) {
            try {
                // console.log('尝试重新检查会议状态...');
                const checkResponse = await fetch('/api/meeting/discussions/active', {  // 修改为正确的API端点
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (checkResponse.ok) {
                    const data = await checkResponse.json();
                    // 查找状态为进行中、未开始或等待人类输入的会议
                    for (const meetingId in data.meetings) {
                        const discussion = data.meetings[meetingId];
                        if (discussion.status === "进行中" || discussion.status === "等待人类输入" || discussion.status === "未开始") {
                            currentMeetingId = meetingId;
                            // console.log(`找到活跃会议ID: ${currentMeetingId}`);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('重新检查会议状态失败:', error);
            }
            
            // 如果仍然没有会议ID，显示错误
            if (!currentMeetingId) {
                showError('找不到当前会议ID，无法发送人类输入');
                return;
            }
        }
        
        // 获取人类角色名称
        const roleName = humanRoleName.textContent;
            
        // 显示加载状态
        humanInputSubmit.disabled = true;
        humanInputSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 发送中...';
            
        try {
            // console.log(`正在发送人类(${roleName})输入...`);
            
            // 获取API密钥
            const apiKey = getCurrentApiKey();
            
            // 发送人类输入到服务器 - 使用新的discussions端点
            const response = await fetch(`/v1/discussions/${currentMeetingId}/human_input`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    agent_name: roleName,
                    message: messageText
                })
            });
            
            // 恢复按钮状态
            humanInputSubmit.disabled = false;
            humanInputSubmit.innerHTML = '发送';
            
            // 检查响应状态
            if (!response.ok) {
                let errorMsg = `发送人类输入失败: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    errorMsg += ` - ${errorData.detail || errorData.message || '未知错误'}`;
                } catch (e) {
                    // 无法解析JSON，使用原始响应文本
                    errorMsg += ` - ${await response.text() || '未知错误'}`;
                }
                
                if (response.status === 404) {
                    // 会议不存在，重置会议ID
                    errorMsg = '会议已结束或不存在，请重新开始会议';
                    currentMeetingId = null;
                    // 显示错误消息
                    addMessageToChat('system', `错误: ${errorMsg}`);
                } else {
                    // 显示错误消息
                    addMessageToChat('system', `发送失败: ${errorMsg}`);
                }
                
                console.error(errorMsg);
                showError(errorMsg);
                
                // 重置等待状态
            isWaitingForHumanInput = false;
                humanInputArea.classList.add('d-none');
                
                // 根据当前模式决定是否显示其他输入区域
                if (currentChatMode === 'group') {
                    // 讨论组模式下，不需要显示任何输入区域
                    // console.log('讨论组模式：人类发言失败，不显示额外输入区域');
                } else {
                    // 非讨论组模式下，显示普通聊天输入区域
                    document.querySelector('.chat-input').classList.remove('d-none');
                }
                
                return;
            }
            
            // 成功发送
            // console.log('人类输入发送成功');
            
            // 解析响应数据
            const data = await response.json();
            // console.log('服务器响应:', data);
            
            // 检查会议是否已结束
            if (data.status === "已结束") {
                // console.log("处理人类输入后，会议已结束，清理定时刷新");
                if (window.refreshTimer) {
                    clearTimeout(window.refreshTimer);
                    window.refreshTimer = null;
                    // console.log("已清理会议刷新定时器");
                }
                
                // 当处理人类输入后会议直接结束，主动请求获取总结
                // console.log("会议已结束，主动请求获取总结内容");
                
                // 检查是否已经在获取总结
                if (!window.isFetchingSummary) {
                    window.isFetchingSummary = true;
                    
                    // 清除之前的定时器
                    if (window.pendingSummaryTimer) {
                        clearTimeout(window.pendingSummaryTimer);
                    }
                    
                    // 在短暂延迟后请求总结（给后端时间生成总结）
                    window.pendingSummaryTimer = setTimeout(() => {
                        // 防止多次调用获取总结函数
                        if (typeof fetchMeetingSummary === 'function') {
                            // 在调用前检查是否已经有总结元素
                            const existingSummaries = document.querySelectorAll('.summary-message');
                            if (existingSummaries.length === 0) {
                                // console.log('开始获取会议总结');
                                fetchMeetingSummary(currentMeetingId);
                            } else {
                                // console.log('总结已存在，跳过获取');
                            }
                        }
                        
                        // 总结获取完成后重置标志
                        setTimeout(() => {
                            window.isFetchingSummary = false;
                            window.pendingSummaryTimer = null;
                        }, 3000);
                    }, 2000);
                }
            }
            
            // 清空输入框
            humanInputMessage.value = '';
            
            // console.log(`===== 发送人类输入成功，开始清理等待状态 - 角色: ${roleName} =====`);

            // 重置等待状态 - 确保状态完全重置
            isWaitingForHumanInput = false;
            waitingForHumanName = null; // 重置当前等待的人类角色名称
            
            // 强制重置状态，确保后续消息不会被错误地视为人类消息
            window.humanInputProcessed = true; // 添加标记表示人类输入已处理
            
            // 清除所有定时器，防止多次请求
            if (window.pendingSummaryTimer) {
                clearTimeout(window.pendingSummaryTimer);
                window.pendingSummaryTimer = null;
            }
            
            // 重置提交标志
            setTimeout(() => {
                isSubmitting = false;
            }, 500);

            // 隐藏人类输入区域，显示普通聊天输入区域
            humanInputArea.classList.add('d-none');

            // 根据当前模式决定是否显示其他输入区域
            if (currentChatMode === 'group') {
                // 讨论组模式下，不需要显示任何输入区域
                // console.log('讨论组模式：人类发言失败，不显示额外输入区域');
            } else {
                // 非讨论组模式下，显示普通聊天输入区域
                const normalChatInput = document.getElementById('normalChatInput');
                if (normalChatInput) {
                    normalChatInput.classList.remove('d-none');
                }
            }

            // 删除所有与等待人类输入相关的临时消息
            // console.log("正在清理所有与人类输入相关的UI元素");

            // 删除提示消息
            const waitingPrompts = document.querySelectorAll('.waiting-human-prompt');
            // console.log(`删除 ${waitingPrompts.length} 个等待提示`);
            waitingPrompts.forEach(prompt => prompt.remove());

            // 删除状态指示器
            const statusIndicators = document.querySelectorAll('.human-input-status');
            // console.log(`删除 ${statusIndicators.length} 个状态指示器`);
            statusIndicators.forEach(indicator => indicator.remove());

            // 删除人类角色的占位容器
            const waitingMsgs = document.querySelectorAll('.waiting-human');
            // console.log(`删除 ${waitingMsgs.length} 个占位容器`);
            waitingMsgs.forEach(msg => msg.remove());

            // 添加人类发言到聊天界面
            addMessageToChat('user', messageText, roleName);
            
            // 等待一段时间，确保后端有时间处理输入
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 重新启动会议流程 - 直接使用discussion_processor继续处理流程
            try {
                // console.log("人类输入已处理，重新启动会议流程获取后续角色发言");
                
                // 获取API密钥
                const apiKey = getCurrentApiKey();
                
                // 使用v1/discussions/stream端点继续会议流程
                const streamResponse = await fetch(`/v1/discussions/stream/${currentMeetingId}`, {
                        method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });
                
                if (!streamResponse.ok) {
                    console.error(`重新连接会议流失败: ${streamResponse.status}`);
                    return;
                }
                
                // 处理流式响应
                const reader = streamResponse.body.getReader();
                const decoder = new TextDecoder();
                
                let currentSpeaker = null;
                let speakerContent = '';
                let speakerContainer = null;
                let speakerContentElement = null;
                
                // console.log("开始处理会议流式响应");
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        // console.log("流式读取结束");
                        break;
                    }
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.substring(6));
                                
                                // 检查是否有内容更新
                                if (data.choices && data.choices.length > 0 && data.choices[0].delta) {
                                    const delta = data.choices[0].delta.content || '';
                                    
                                    // 检查是否结束
                                    if (data.choices[0].finish_reason === "stop") {
                                        // console.log("检测到会议结束信号");
                                        
                                        // 清理定时刷新
                                        if (window.refreshTimer) {
                                            clearTimeout(window.refreshTimer);
                                            window.refreshTimer = null;
                                            // console.log("已清理会议刷新定时器");
                                        }
                                    }
                                    
                                    // 检查是否有会议结束和总结标记
                                    if (delta.includes("## 会议结束") || delta.includes("会议总结") || delta.includes("## 会议总结")) {
                                        // console.log("检测到会议结束或总结标记: ", delta.substring(0, 30));
                                        
                                        // 如果有之前的发言者，保存之前的内容
                                        if (currentSpeaker && speakerContent.trim()) {
                                            // 添加内容到UI
                                            if (speakerContentElement) {
                                                speakerContentElement.innerHTML = marked.parse(speakerContent);
                                                processMathJax(speakerContentElement);
                                            }
                                        }
                                        
                                        // 创建总结发言人
                                        currentSpeaker = "总结";
                                        speakerContent = delta;  // 先添加当前delta到内容中
                                        
                                        // 查找已经存在的总结消息
                                        const existingSummaries = document.querySelectorAll('.summary-message');
                                        if (existingSummaries.length > 0) {
                                            // 如果已经存在总结容器，使用它
                                            speakerContainer = existingSummaries[0];
                                            speakerContentElement = speakerContainer.querySelector('.agent-content');
                                            if (!speakerContentElement) {
                                                speakerContentElement = document.createElement('div');
                                                speakerContentElement.classList.add('agent-content');
                                                speakerContainer.appendChild(speakerContentElement);
                                            }
                                            
                                            insertExportButtonToSummary(); 
                                            // console.log("使用已存在的总结容器");
                                        } else {
                                            // 创建新的发言容器
                                            speakerContainer = document.createElement('div');
                                            speakerContainer.classList.add('agent-message', 'summary-message');
                                            
                                            const speakerHeader = document.createElement('div');
                                            speakerHeader.classList.add('agent-header');
                                            
                                            const speakerNameElement = document.createElement('div');
                                            speakerNameElement.classList.add('agent-name');
                                            speakerNameElement.textContent = "会议总结";
                                            
                                            const speakerBadge = document.createElement('div');
                                            speakerBadge.classList.add('agent-badge');
                                            speakerBadge.textContent = 'AI';
                                            
                                            speakerHeader.appendChild(speakerNameElement);
                                            speakerHeader.appendChild(speakerBadge);
                                            
                                            speakerContentElement = document.createElement('div');
                                            speakerContentElement.classList.add('agent-content');
                                            
                                            speakerContainer.appendChild(speakerHeader);
                                            speakerContainer.appendChild(speakerContentElement);
                                            
                                            chatMessages.appendChild(speakerContainer);
                                            
                                            insertExportButtonToSummary();
                                            // console.log("创建了新的总结容器");
                                        }
                                        
                                        // 确保总结标题显示在顶部
                                        speakerContentElement.innerHTML = marked.parse(speakerContent);
                                        processMathJax(speakerContentElement);
                                        
                                        // 清除检查人类输入的定时器
                                        if (humanCheckInterval) {
                                            clearInterval(humanCheckInterval);
                                            humanCheckInterval = null;
                                        }
                                        
                                        // 设置会议为已结束状态
                                        if (currentMeetingId) {
                                            // console.log("会议已结束，清除会议ID");
                                            currentMeetingId = null;
                                        }
                                        
                                        // 滚动到底部
                                        scrollToBottom();
                                        continue;
                                    }
                                    // 当已经在显示总结内容时，继续累积总结内容
                                    else if (currentSpeaker === "总结") {
                                        // // console.log("正在累积总结内容: " + delta.substring(0, 30) + (delta.length > 30 ? "..." : ""));
                                        speakerContent += delta;
                                        
                                        // 更新总结内容
                                        if (speakerContentElement) {
                                            speakerContentElement.innerHTML = marked.parse(speakerContent);
                                            processMathJax(speakerContentElement);
                                            // 滚动到底部
                                            scrollToBottom();
                                        }
                                        continue;
                                    }
                                    
                                    // 检查是否有新发言人标记 "### 名称 发言："
                                    const speakerMatch = delta.match(/###\s+(.+?)\s+发言：/);
                                    
                                    if (speakerMatch) {
                                        // 如果有之前的发言者，保存之前的内容
                                        if (currentSpeaker && speakerContent.trim()) {
                                            // 添加内容到UI
                                            if (speakerContentElement) {
                                                speakerContentElement.innerHTML = marked.parse(speakerContent);
                                                processMathJax(speakerContentElement);
                                            }
                                        }
                                        
                                        // 新发言人开始
                                        currentSpeaker = speakerMatch[1];
                                        speakerContent = '';
                                        
                                        // 检查是否是人类角色
                                        const isHumanRole = humanRoles.some(role => role.name === currentSpeaker);
                                        
                                        if (isHumanRole) {
                                            // 如果是等待同一个人类发言，跳过(因为我们刚刚已经发送过了)
                                            continue;
                                        } else {
                                            // 为每个新的AI发言创建一个唯一标识符
                                            const speakerId = `speaker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                            
                                            // 创建新的发言容器
                                            speakerContainer = document.createElement('div');
                                            speakerContainer.classList.add('agent-message');
                                            speakerContainer.setAttribute('data-speaker-id', speakerId);
                                            
                                            const speakerHeader = document.createElement('div');
                                            speakerHeader.classList.add('agent-header');
                                            
                                            const speakerNameElement = document.createElement('div');
                                            speakerNameElement.classList.add('agent-name');
                                            speakerNameElement.textContent = currentSpeaker;
                                            
                                            const speakerBadge = document.createElement('div');
                                            speakerBadge.classList.add('agent-badge');
                                            speakerBadge.textContent = 'AI';
                                            
                                            speakerHeader.appendChild(speakerNameElement);
                                            speakerHeader.appendChild(speakerBadge);
                                            
                                            speakerContentElement = document.createElement('div');
                                            speakerContentElement.classList.add('agent-content');
                                            
                                            speakerContainer.appendChild(speakerHeader);
                                            speakerContainer.appendChild(speakerContentElement);
                                            
                                            chatMessages.appendChild(speakerContainer);
                                            scrollToBottom();
                                            
                                            // console.log(`创建新的发言容器，发言者: ${currentSpeaker}, ID: ${speakerId}`);
                                        }
                                    } else if (delta.includes("[WAITING_FOR_HUMAN_INPUT:")) {
                                        // 检测到等待人类输入的标记
                                        const match = delta.match(/\[WAITING_FOR_HUMAN_INPUT:(.*?)\]/);
                                        if (match && match[1]) {
                                            const humanName = match[1];
                                            // console.log(`检测到服务器发送的等待人类输入标记: ${humanName}`);
                                            
                                            // 保存当前发言内容，确保不会被覆盖
                                            if (currentSpeaker && speakerContent.trim()) {
                                                // console.log(`保存当前角色 ${currentSpeaker} 的内容，长度: ${speakerContent.length}`);
                                                // 将内容添加到UI，确保之前的内容不会丢失
                                                if (speakerContentElement) {
                                                    // 移除可能包含的等待人类输入文本
                                                    const cleanContent = speakerContent.replace(/\[WAITING_FOR_HUMAN_INPUT:.*?\]/g, '').trim();
                                                    speakerContentElement.innerHTML = marked.parse(cleanContent);
                                                    processMathJax(speakerContentElement);
                                                }
                                            }
                                            
                                            // 确保当前发言被完全呈现后，再显示等待人类输入状态
                                            setTimeout(() => {
                                                // 使用独立的函数显示等待状态，不创建可能覆盖前一个发言的提示
                                                showWaitingForHumanInput(humanName);
                                            }, 100);
                                        }
                                        continue;
                                    } else {
                                        // 累积当前发言者的内容
                                        speakerContent += delta;
                                        
                                        // 检查是否包含等待人类输入的文本
                                        const waitingTextMatch = delta.match(/等待人类角色\s+(.+?)\s+输入/);
                                        if (waitingTextMatch && waitingTextMatch[1]) {
                                            // 如果是系统消息中包含"等待人类角色 XX 输入"的文本
                                            const humanName = waitingTextMatch[1];
                                            // console.log(`检测到系统消息中的等待人类输入提示: ${humanName}`);
                                            
                                            // 记录原始内容，稍后会恢复
                                            // console.log("检测到等待人类输入文本，但不会影响现有消息");
                                            
                                            // 确保当前内容已保存
                                            if (currentSpeaker && speakerContent.trim() && speakerContentElement) {
                                                // 移除等待人类输入的提示
                                                const cleanContent = speakerContent.replace(/等待人类角色\s+(.+?)\s+输入/g, '').trim();
                                                speakerContentElement.innerHTML = marked.parse(cleanContent);
                                                processMathJax(speakerContentElement);
                                            }
                                            
                                            // 使用改进的方法显示等待状态，确保不会覆盖之前的消息
                                            setTimeout(() => {
                                                showWaitingForHumanInput(humanName);
                                            }, 100);
                                            
                                            // 跳过将这条消息添加到UI
                                            continue;
                                        }
                                        
                                        // 仅当有当前发言者容器时才更新UI
                                        if (speakerContentElement) {
                                            speakerContentElement.innerHTML = marked.parse(speakerContent);
                                            processMathJax(speakerContentElement);
                                            scrollToBottom();
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('解析流式响应失败:', e, line);
                            }
                        }
                    }
                }
                
                // console.log("会议流式响应处理完成");
                
                // 如果会议结束但未看到总结，主动请求获取总结
                if (data.status === "已结束" || currentMeetingId === null) {
                    // console.log("流式处理结束，会议已结束，主动请求获取总结");
                    setTimeout(() => {
                        fetchMeetingSummary(currentMeetingId || data.meeting_id);
                    }, 1000);
                }
                
                } catch (error) {
                console.error("重连会议流失败:", error);
                }
            
        } catch (error) {
            console.error('发送人类输入时出错:', error);
            
            // 恢复按钮状态
            humanInputSubmit.disabled = false;
            humanInputSubmit.innerHTML = '发送';
            
            // 显示错误消息
            showError(`发送失败: ${error.message}`);
            
            // 重置等待状态
                isWaitingForHumanInput = false;
                humanInputArea.classList.add('d-none');
                document.querySelector('.chat-input').classList.remove('d-none');
        }
    }
    
    // 构建聊天消息历史
    function buildChatMessages(newMessage) {
        const messages = [...messageHistory];
        messages.push({ role: 'user', content: newMessage });
        return messages;
    }
    
    // 添加消息到聊天界面
    function addMessageToChat(role, content, speakerName = null) {
        // 确保content是字符串类型
        if (content === null || content === undefined) {
            content = "";
        } else if (typeof content !== 'string') {
            try {
                content = String(content);
            } catch (e) {
                console.error('无法将内容转换为字符串:', e);
                content = "消息内容格式错误";
            }
        }
        
        // 创建一个唯一标识符
        const messageId = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', role);
        messageContainer.setAttribute('data-message-id', messageId);
        
        // 创建消息头部布局
        const messageHeader = document.createElement('div');
        messageHeader.classList.add('message-header');
        
        // 添加头像
        const avatarElement = document.createElement('div');
        avatarElement.classList.add('message-avatar');
        if (role === 'ai') {
            avatarElement.innerHTML = '<div class="text-avatar ai-avatar">AI</div>';
        } 
        
        // 创建名称元素
        const nameElement = document.createElement('div');
        nameElement.classList.add('message-name');
        nameElement.textContent = speakerName || (role === 'ai' ? '助手' : role === 'user' ? '人类' : '系统');
        
        // 根据角色调整头像和名称的顺序
        if (role === 'user' || role === 'human-message') {
            messageHeader.appendChild(nameElement);
            messageHeader.appendChild(avatarElement);
        } else {
            messageHeader.appendChild(avatarElement);
            messageHeader.appendChild(nameElement);
        }
        
        messageContainer.appendChild(messageHeader);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        // 使用try-catch包裹markdown解析，避免解析错误
        try {
            messageContent.innerHTML = marked.parse(content);
            processMathJax(messageContent);
        } catch (e) {
            console.error('Markdown解析失败:', e);
            messageContent.textContent = content; // 直接显示原始内容作为后备
        }
        
        // 使用统一的代码块处理函数
        setTimeout(() => {
            setupCodeBlockCopyButtons();
            highlightCodeBlocks();
            
            // 如果是AI消息，添加导出按钮
            if (role === 'ai') {
                addExportButtonToMessage(messageContainer);
            }
        }, 0);
        
        messageContainer.appendChild(messageContent);
        chatMessages.appendChild(messageContainer);
        
        // console.log(`添加消息到聊天: 角色=${role}, 发言者=${speakerName || '未指定'}, ID=${messageId}`);
        
        // 使用滚动控制函数
        scrollToBottom();
        
        return messageId;
    }
    
    // 更新讨论组聊天界面
    function updateDiscussionChat(data) {
        // console.log('更新讨论组聊天内容', data);
        
        if (!data || !data.rounds) {
            console.error('无效的讨论数据');
            return;
        }
        
        // 获取聊天容器并清空现有内容
        const chatContainer = document.getElementById('chatMessages');
        chatContainer.innerHTML = '';
        
        // 遍历所有讨论轮次
        data.rounds.forEach((round, roundIndex) => {
            // 创建讨论轮次容器
            const roundContainer = document.createElement('div');
            roundContainer.className = 'discussion-round';
            
            // 创建轮次标题
            const roundTitle = document.createElement('div');
            roundTitle.className = 'discussion-round-title';
            roundTitle.textContent = `讨论轮次 ${roundIndex + 1}`;
            roundContainer.appendChild(roundTitle);
            
            // 遍历该轮次内的所有消息
            round.messages.forEach(message => {
                // 创建角色消息容器
                const agentMessageContainer = document.createElement('div');
                agentMessageContainer.className = 'agent-message';
                
                // 创建角色头部
                const agentHeader = document.createElement('div');
                agentHeader.className = 'agent-header';
                
                // 创建角色名称
                const agentName = document.createElement('div');
                agentName.className = 'agent-name';
                agentName.textContent = message.role_name || '未知角色';
                agentHeader.appendChild(agentName);
                
                // 如果有角色类型，显示为徽章
                if (message.role_type) {
                    const agentBadge = document.createElement('div');
                    agentBadge.className = 'agent-badge';
                    agentBadge.textContent = message.role_type;
                    agentHeader.appendChild(agentBadge);
                }
                
                // 添加头部到消息容器
                agentMessageContainer.appendChild(agentHeader);
                
                // 创建消息内容
                const agentContent = document.createElement('div');
                agentContent.className = 'agent-content';
                
                // 确保消息内容是字符串
                let messageContent = message.content;
                if (messageContent === null || messageContent === undefined) {
                    messageContent = "";
                } else if (typeof messageContent !== 'string') {
                    try {
                        messageContent = String(messageContent);
                    } catch (e) {
                        console.error('无法将内容转换为字符串:', e);
                        messageContent = "消息内容格式错误";
                    }
                }
                
                // 使用marked处理消息内容中的Markdown
                try {
                    if (window.marked) {
                        agentContent.innerHTML = marked.parse(messageContent);
                        processMathJax(agentContent);
                    } else {
                        agentContent.textContent = messageContent;
                    }
                } catch (e) {
                    console.error('Markdown解析失败:', e);
                    agentContent.textContent = messageContent; // 直接显示原始内容作为后备
                }
                
                agentMessageContainer.appendChild(agentContent);
                
                // 添加消息到轮次容器
                roundContainer.appendChild(agentMessageContainer);
                
                // 为每个代理消息添加导出按钮
                addExportButtonToMessage(agentMessageContainer);
            });
            
            // 添加轮次容器到聊天容器
            chatContainer.appendChild(roundContainer);
            
            // 为讨论轮次添加导出按钮
            addExportButtonToMessage(roundContainer);
        });
        
        // 高亮处理代码块
        highlightCodeBlocks();
        // 为代码块添加复制按钮
        setupCodeBlockCopyButtons();
        
        // 如果需要人类输入，显示人类输入区域
        if (data.wait_for_human) {
            showHumanInputArea(data.human_role_name || '您');
        }
        
        // 滚动到底部
        scrollToBottom();
    }
    
    // 重置聊天
    function resetChat() {
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h4 data-translate="welcomeToChat">ChatDeepGemini</h4>
            </div>
        `;
        
        // 清空消息历史
        messageHistory = [];
        
        // 重置讨论组数据
        currentMeetingId = null;
        humanRoles = [];
        isWaitingForHumanInput = false;
        
        // 清理定时刷新
        if (window.refreshTimer) {
            clearTimeout(window.refreshTimer);
            window.refreshTimer = null;
            // console.log("已清理会议刷新定时器");
        }
        
        // 隐藏人类输入区域
        humanInputArea.classList.add('d-none');
        
        // 根据当前模式显示正确的输入区域
        const normalChatInput = document.getElementById('normalChatInput');
        const discussionTopicInput = document.getElementById('discussionTopicInput');
        
        if (currentChatMode === 'group') {
            // 讨论组模式: 显示主题输入区
            if (normalChatInput) normalChatInput.classList.add('d-none');
            if (discussionTopicInput) discussionTopicInput.classList.remove('d-none');
        } else {
            // 其他模式: 显示普通输入区
            if (normalChatInput) normalChatInput.classList.remove('d-none');
            if (discussionTopicInput) discussionTopicInput.classList.add('d-none');
        }
    }
    
    // 显示错误消息
    function showError(message) {
        addMessageToChat('system', `错误: ${message}`);
    }
    
    // 显示加载状态
    function showLoading() {
        loadingSpinner.classList.add('show');
    }
    
    // 隐藏加载状态
    function hideLoading() {
        loadingSpinner.classList.remove('show');
    }
    
    // 语言转换支持
    function updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        const currentLang = getCurrentLanguage();
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getCurrentTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
    
    // 添加到现有app.js的语言转换函数
    if (typeof translations !== 'undefined') {
        // 添加聊天界面翻译
        translations.en = {
            ...translations.en,
            chatInterface: 'Chat Interface',
            singleModel: 'Single Model',
            relayChain: 'Relay Chain',
            roleChat: 'Role Chat',
            discussionGroup: 'Discussion Group',
            selectModel: 'Select Model',
            selectRelayChain: 'Select Relay Chain',
            selectRole: 'Select Role',
            selectDiscussionGroup: 'Select Discussion Group',
            discussionTopic: 'Discussion Topic',
            exportMarkdown: 'Export Chat',
            send: 'Send',
            welcomeToChat: 'Welcome to DeepGemini Chat Interface',
            chatInstructions: 'Select a chat mode and start the conversation',
            speakingAs: 'Speaking as ',
            identity: '',
            submitMessage: 'Submit Message'
        };
        
        translations.zh = {
            ...translations.zh,
            chatInterface: '对话界面',
            singleModel: '单个模型',
            relayChain: '接力链',
            roleChat: '角色对话',
            discussionGroup: '讨论组',
            selectModel: '选择模型',
            selectRelayChain: '选择接力链',
            selectRole: '选择角色',
            selectDiscussionGroup: '选择讨论组',
            discussionTopic: '讨论主题',
            exportMarkdown: '导出对话',
            send: '发送',
            ChatDeepGemini: 'ChatDeepGemini',
            chatInstructions: '选择模式并开始对话',
            speakingAs: '正在以',
            identity: '身份发言',
            submitMessage: '提交发言'
        };
        
        // 调用更新翻译
        updateTranslations();
    }
    
    // 获取默认API密钥
    async function fetchDefaultApiKey() {
        try {
            const response = await fetch('/v1/system/default_api_key');
            
            if (response.ok) {
                const data = await response.json();
                if (data.api_key) {
                    defaultApiKey = data.api_key;
                    // 存储到localStorage中，方便后续使用
                    localStorage.setItem('api_key', defaultApiKey);
                    // console.log('成功获取到默认API密钥');
                }
            } else {
                console.warn('无法获取默认API密钥，将使用预设值');
            }
        } catch (error) {
            console.error('获取默认API密钥失败:', error);
        }
    }
    
    // 获取当前API密钥
    function getCurrentApiKey() {
        return localStorage.getItem('api_key') || defaultApiKey;
    }
    
    // 刷新讨论状态，获取最新消息
    async function refreshDiscussion() {
        if (!currentMeetingId) {
            // console.log("没有活跃的会议ID，无法刷新讨论");
            return;
        }
        
        try {
            // 获取API密钥
            const apiKey = getCurrentApiKey();
            
            // 显示加载指示器
            showLoading();
            
            // console.log(`刷新会议状态: meeting_id=${currentMeetingId}`);
            
            // 获取会议状态
            const response = await fetch(`/api/meeting/discussions/${currentMeetingId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `${apiKey}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // 会议不存在，重置会议ID
                    currentMeetingId = null;
                    showError("会议已结束或不存在");
                    
                    // 清理定时刷新
                    if (window.refreshTimer) {
                        clearTimeout(window.refreshTimer);
                        window.refreshTimer = null;
                        // console.log("已清理会议刷新定时器");
                    }
                    return;
                }
                console.error(`获取会议状态失败: ${response.status}`);
                return;
            }
            
            const data = await response.json();
            // console.log('会议最新状态:', data);
            
            // 更新讨论界面
            updateDiscussionChat(data);
            
            // 检查会议是否已结束
            if (data.status === "已结束") {
                // console.log("会议已结束，清理资源");
                
                // 重置会议ID，防止继续发送请求
                currentMeetingId = null;
                
                // 清理定时刷新
                if (window.refreshTimer) {
                    clearTimeout(window.refreshTimer);
                    window.refreshTimer = null;
                }
                
                // 不再发送额外的结束请求，总结应该已经在流输出中
                hideLoading();
                return;
            }
            
            // 如果会议仍在进行中，设置下一次刷新
            if (window.refreshTimer) {
                clearTimeout(window.refreshTimer);
            }
            window.refreshTimer = setTimeout(refreshDiscussion, 3000);
            
            // 隐藏加载指示器
            hideLoading();
        } catch (error) {
            console.error('刷新讨论失败:', error);
            hideLoading();
            
            // 继续设置下一次刷新（即使出错也尝试）
            if (window.refreshTimer) {
                clearTimeout(window.refreshTimer);
            }
            window.refreshTimer = setTimeout(refreshDiscussion, 5000);  // 出错后延长等待时间
        }
    }
    
    // 显示等待人类输入状态
    function showWaitingForHumanInput(roleName) {
        // console.log(`====== 显示等待人类输入状态开始 - 角色: ${roleName} ======`);
        
        if (!roleName) {
            console.error("缺少人类角色名称，无法显示等待状态");
            return;
        }
        
        if (isWaitingForHumanInput) {
            // console.log("已经处于等待状态，不重复处理");
            return; // 避免重复显示
        }
        
        // 设置等待人类输入状态
        isWaitingForHumanInput = true;
        waitingForHumanName = roleName; // 记录当前等待的人类角色名称
        
        // console.log(`设置等待人类输入状态 - 角色: ${roleName}`);
        
        // 更新UI以显示人类输入区域
        const humanRoleNameElem = document.getElementById('humanRoleName');
        if (humanRoleNameElem) {
            humanRoleNameElem.textContent = roleName;
        } else {
            console.error("找不到 humanRoleName 元素");
        }
        
        const humanInputAreaElem = document.getElementById('humanInputArea');
        if (humanInputAreaElem) {
            humanInputAreaElem.classList.remove('d-none');
        } else {
            console.error("找不到 humanInputArea 元素");
        }
        
        // 在讨论组模式下，隐藏主题输入区域
        if (currentChatMode === 'group') {
            const discussionTopicInput = document.getElementById('discussionTopicInput');
            if (discussionTopicInput) {
                discussionTopicInput.classList.add('d-none');
            }
        } else {
            // 非讨论组模式下，隐藏普通聊天输入
            const chatInputElem = document.getElementById('normalChatInput');
            if (chatInputElem) {
                chatInputElem.classList.add('d-none');
            } else {
                console.error("找不到 normalChatInput 元素");
            }
        }
        
        // 首先移除所有现有的人类输入状态指示器
        const existingIndicators = document.querySelectorAll('.human-input-status');
        // console.log(`移除 ${existingIndicators.length} 个现有状态指示器`);
        existingIndicators.forEach(indicator => indicator.remove());
        
        // 创建一个与正常消息在视觉上区分的状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'human-input-status';
        statusIndicator.setAttribute('data-role', roleName);
        // 添加唯一标识符
        statusIndicator.setAttribute('data-status-id', `status-${Date.now()}`);
        statusIndicator.innerHTML = `<p class="text-info"><i class="fas fa-user-edit"></i> 系统提示: 等待人类角色 ${roleName} 输入...</p>`;
        
        // 获取聊天容器
        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) {
            console.error("找不到聊天消息容器");
            return;
        }
        
        // 将状态指示器添加到聊天容器最底部
        chatContainer.appendChild(statusIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        // console.log("已添加状态指示器到聊天容器底部");
        
        // 不再创建隐藏的占位容器，避免干扰
        
        // 聚焦输入框
        const humanInputMessage = document.getElementById('humanInputMessage');
        if (humanInputMessage) {
            humanInputMessage.focus();
            // console.log("已聚焦到人类输入框");
        } else {
            console.error("找不到 humanInputMessage 元素");
        }
        
        // console.log(`====== 显示等待人类输入状态完成 - 角色: ${roleName} ======`);
    }
    
    // 这里删除重复的滚动控制按钮代码
    
});

// 侧边栏导航
document.addEventListener('DOMContentLoaded', function() {
    // 监听侧边栏项目点击
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // 如果是chatllm页面，直接导航
            if (page === 'chatllm') {
                window.location.href = '/static/chatllm.html';
                return;
            }
            
            // 其他页面导航到index.html并带上页面参数
            window.location.href = '/static/index.html?page=' + page;
        });
    });
}); 

// 补充toggleTheme函数
function toggleTheme() {
    const body = document.body;
    const darkModeControl = document.querySelector('.dark-mode-control');
    const darkModeText = darkModeControl.querySelector('[data-translate="darkMode"]');
    
    body.classList.toggle('dark-theme');
    darkModeControl.classList.toggle('dark');
    
    // 更新文字
    const lang = localStorage.getItem('preferred_language') || 'zh';
    if (body.classList.contains('dark-theme')) {
        darkModeText.textContent = lang === 'zh' ? '日间模式' : 'Light Mode';
    } else {
        darkModeText.textContent = lang === 'zh' ? '夜间模式' : 'Dark Mode';
    }
    
    // 保存主题偏好
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('dark_theme', isDark);
    
    // 触发主题变化事件，更新相关样式
    document.dispatchEvent(new CustomEvent('themeChanged'));
    
    // 更新代码块样式
    updateCodeBlocksTheme();
} 

// 更新代码块主题
function updateCodeBlocksTheme() {
    // console.log('更新代码块主题');
    const isDarkMode = document.body.classList.contains('dark-theme');
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        if (isDarkMode) {
            block.classList.add('dark-code');
        } else {
            block.classList.remove('dark-code');
        }
    });
    
    // 在主题切换后重新处理一下代码块的复制按钮
    setTimeout(() => setupCodeBlockCopyButtons(), 0);
}

// 添加主题变化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('themeChanged', updateCodeBlocksTheme);
});

// 添加一个新函数来专门获取会议总结
async function fetchMeetingSummary(meetingId) {
    if (!meetingId) {
        // console.log("无法获取总结：会议ID不存在");
        return;
    }
}

// 修复exportChatAsMarkdown函数
function exportChatAsMarkdown() {
    // console.log('开始导出对话为Markdown文件');
    const checkedRadio = document.querySelector('input[name="chatMode"]:checked');
    if (checkedRadio) {
        currentChatMode = checkedRadio.value;
    }
    const currentMode = currentChatMode || 'single';
    let markdownContent = `# DeepGemini 对话记录\n\n`;
    markdownContent += `导出时间: ${new Date().toLocaleString()}\n\n`;
    // console.log(`当前模式: ${currentMode}`);
    
    switch (currentMode) {
        case 'single':
            const modelId = singleModelSelect.value;
            const modelConfig = window.modelConfigs?.[modelId] || {};
            const isReasoningModel = modelConfig.type === 'reasoning';
            if (isReasoningModel) {
                markdownContent += `模型: ${modelConfig.name || '未知模型'} (思考型模型)\n\n`;
            } else {
                const modelName = modelConfig.name || '未知模型';
                markdownContent += `模型: ${modelName}\n\n`;
            }
            break;
        case 'relay':
            const relayId = relayChainSelect.value;
            const relayOption = relayChainSelect.options[relayChainSelect.selectedIndex];
            const relayName = relayOption ? relayOption.textContent : '未知接力链';
            markdownContent += `接力链模式: ${relayName}\n\n`;
            break;
        case 'role':
            const roleId = roleChatSelect.value;
            const roleOption = roleChatSelect.options[roleChatSelect.selectedIndex];
            const roleName = roleOption ? roleOption.textContent : '未知角色';
            markdownContent += `角色对话模式: ${roleName}\n\n`;
            break;
    }

    const chatContainer = document.getElementById('chatMessages');
    const messageContainers = chatContainer.querySelectorAll('.message-container');
    messageContainers.forEach(container => {
        if (container.classList.contains('welcome-message')) return;
        const role = container.classList.contains('ai') ? 'AI' :
                     container.classList.contains('user') ? '用户' :
                     container.classList.contains('system') ? '系统' : '其他';
        const nameElement = container.querySelector('.message-name');
        const name = nameElement ? nameElement.textContent : role;
        const contentElement = container.querySelector('.message-content');
        if (!contentElement) return;

        let content = contentElement.innerHTML;

        // 1. 处理所有代码块，优先用 innerText 读取原始内容
        const codeBlocks = contentElement.querySelectorAll('pre code');
        let codeBlockMap = {};
        let codeBlockIdx = 0;
        codeBlocks.forEach(block => {
            let language = '';
            const langMatch = block.className.match(/language-([\w\d]+)/);
            if (langMatch) language = langMatch[1];
            const code = block.innerText || block.textContent;
            const placeholder = `__CODE_BLOCK_${codeBlockIdx}__`;
            codeBlockMap[placeholder] = `\`\`\`${language}\n${code}\n\`\`\``;
            // 替换原有 HTML 代码块为占位符
            const blockHtml = block.parentNode.outerHTML;
            content = content.replace(blockHtml, placeholder);
            codeBlockIdx++;
        });

        // 2. 处理其他 HTML 标签为 Markdown
        content = content
            .replace(/<\/?p>/g, '\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<\/?strong>/g, '**')
            .replace(/<\/?em>/g, '_')
            .replace(/<\/?code>/g, '`')
            .replace(/<\/?[^>]+(>|$)/g, '') // 删除其他HTML标签
            .trim();

        // 3. 恢复代码块内容
        Object.keys(codeBlockMap).forEach(placeholder => {
            content = content.replace(placeholder, codeBlockMap[placeholder]);
        });

        markdownContent += `## ${name}\n\n${content}\n\n`;

        // 思考型模型
        if (currentMode === 'single') {
            const modelConfig = window.modelConfigs?.[singleModelSelect.value] || {};
            const isReasoningModel = modelConfig.type === 'reasoning';
            if (isReasoningModel && role === 'AI') {
                const thinkingContent = container.querySelector('.thinking-content');
                if (thinkingContent && !thinkingContent.classList.contains('collapsed')) {
                    let thinking = thinkingContent.innerHTML;
                    // 处理思考内容中的代码块
                    const thinkingCodeBlocks = thinkingContent.querySelectorAll('pre code');
                    let thinkingCodeBlockMap = {};
                    let thinkingCodeBlockIdx = 0;
                    thinkingCodeBlocks.forEach(block => {
                        let language = '';
                        const langMatch = block.className.match(/language-([\w\d]+)/);
                        if (langMatch) language = langMatch[1];
                        const code = block.innerText || block.textContent;
                        const placeholder = `__THINKING_CODE_BLOCK_${thinkingCodeBlockIdx}__`;
                        thinkingCodeBlockMap[placeholder] = `\`\`\`${language}\n${code}\n\`\`\``;
                        const blockHtml = block.parentNode.outerHTML;
                        thinking = thinking.replace(blockHtml, placeholder);
                        thinkingCodeBlockIdx++;
                    });
                    thinking = thinking
                        .replace(/<\/?p>/g, '\n')
                        .replace(/<br\s*\/?>/g, '\n')
                        .replace(/<\/?strong>/g, '**')
                        .replace(/<\/?em>/g, '_')
                        .replace(/<\/?code>/g, '`')
                        .replace(/<\/?[^>]+(>|$)/g, '') // 删除其他HTML标签
                        .trim();
                    Object.keys(thinkingCodeBlockMap).forEach(placeholder => {
                        thinking = thinking.replace(placeholder, thinkingCodeBlockMap[placeholder]);
                    });
                    if (thinking) {
                        markdownContent += `### 思考过程\n\n${thinking}\n\n---\n\n`;
                    }
                }
            }
        }
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let fileName;
    switch (currentMode) {
        case 'single':
            fileName = `deepgemini-chat-${Date.now()}.md`;
            break;
        case 'relay':
            fileName = `deepgemini-relay-chat-${Date.now()}.md`;
            break;
        case 'role':
            fileName = `deepgemini-role-chat-${Date.now()}.md`;
            break;
        case 'group':
            fileName = `deepgemini-group-discussion-${Date.now()}.md`;
            break;
        default:
            fileName = `deepgemini-chat-${Date.now()}.md`;
    }
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 将导出功能添加到每个AI消息
function addExportButtonToMessage(messageContainer) {
    // 获取当前聊天模式
    let currentMode = 'single'; // 默认为单模型对话
    
    // 检查是否存在全局的currentChatMode变量
    if (typeof currentChatMode !== 'undefined') {
        currentMode = currentChatMode;
    } else {
        // 尝试从DOM确定当前模式
        const activeModeRadio = document.querySelector('input[name="chatMode"]:checked');
        if (activeModeRadio) {
            currentMode = activeModeRadio.value;
        }
    }
    
    // 只有在特定情况下添加导出按钮
    if (currentMode === 'group') {
        // 讨论组模式 - 在讨论轮次容器和AI代理消息上添加导出按钮
        if (!messageContainer.classList.contains('discussion-round') && 
            !messageContainer.classList.contains('agent-message')) {
            return;
        }
    } else {
        // 其他模式(单模型、接力链、角色对话) - 只在AI消息上添加导出按钮
        if (!messageContainer.classList.contains('ai')) {
            return;
        }
    }
    
    // 检查是否已有导出按钮
    if (messageContainer.querySelector('.message-export-btn')) {
        return;
    }
    
    // 创建导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.className = 'message-export-btn';
    exportBtn.innerHTML = '<i class="fas fa-download"></i>';
    exportBtn.title = '导出对话';
    
    // 添加点击事件来导出当前对话
    exportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 确保全局变量currentChatMode有效
        if (typeof currentChatMode === 'undefined' || currentChatMode === null) {
            // 尝试从DOM确定当前模式
            const activeModeRadio = document.querySelector('input[name="chatMode"]:checked');
            if (activeModeRadio) {
                window.currentChatMode = activeModeRadio.value;
            } else {
                // 默认设为单模型模式
                window.currentChatMode = 'single';
            }
        }
        
        exportChatAsMarkdown();
    });
    
    // 添加到消息容器
    messageContainer.appendChild(exportBtn);
}

// 为当前和新添加的代码块添加复制按钮
function setupCodeBlockCopyButtons() {
    // 获取所有没有复制按钮的代码块
    const codeBlocks = document.querySelectorAll('pre code:not([data-copy-initialized])');
    
    codeBlocks.forEach(block => {
        // 标记为已初始化
        block.setAttribute('data-copy-initialized', 'true');
        
        // 添加复制按钮
        const pre = block.parentNode;
        
        // 防止重复添加按钮
        const existingButton = pre.querySelector('.code-copy-btn');
        if (existingButton) {
            return;
        }
        
        // 创建右上角复制按钮
        const copyButtonTop = document.createElement('button');
        copyButtonTop.className = 'code-copy-btn';
        copyButtonTop.innerHTML = '<i class="fas fa-copy"></i>';
        copyButtonTop.title = '复制代码';
        
        // 创建右下角复制按钮
        const copyButtonBottom = document.createElement('button');
        copyButtonBottom.className = 'code-copy-btn-bottom';
        copyButtonBottom.innerHTML = '<i class="fas fa-copy"></i>';
        copyButtonBottom.title = '复制代码';
        
        // 创建复制代码的函数
        const copyCode = function(e, button) {
            e.preventDefault();
            e.stopPropagation();
            
            const code = block.textContent;
            
            // 使用更可靠的复制方法
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.style.position = 'fixed';  // 避免滚动到页面底部
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    // 复制成功效果
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.classList.add('copied');
                    
                    // 同时更新两个按钮状态
                    const otherButton = button === copyButtonTop ? copyButtonBottom : copyButtonTop;
                    otherButton.innerHTML = '<i class="fas fa-check"></i>';
                    otherButton.classList.add('copied');
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                        otherButton.innerHTML = originalHTML;
                        otherButton.classList.remove('copied');
                    }, 1500);
                }
            } catch (err) {
                console.error('无法复制代码:', err);
                // 回退到navigator.clipboard API
                navigator.clipboard.writeText(code).then(() => {
                    // 复制成功效果
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.classList.add('copied');
                    
                    // 同时更新两个按钮状态
                    const otherButton = button === copyButtonTop ? copyButtonBottom : copyButtonTop;
                    otherButton.innerHTML = '<i class="fas fa-check"></i>';
                    otherButton.classList.add('copied');
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                        otherButton.innerHTML = originalHTML;
                        otherButton.classList.remove('copied');
                    }, 1500);
                });
            } finally {
                document.body.removeChild(textarea);
            }
        };
        
        // 添加事件监听器
        copyButtonTop.addEventListener('click', (e) => copyCode(e, copyButtonTop));
        copyButtonBottom.addEventListener('click', (e) => copyCode(e, copyButtonBottom));
        
        // 为复制按钮容器添加定位
        if (!pre.style.position || pre.style.position === 'static') {
            pre.style.position = 'relative';
        }
        
        // 添加两个按钮到代码块
        pre.appendChild(copyButtonTop);
        pre.appendChild(copyButtonBottom);
    });
}

// 添加一个MutationObserver来监听DOM变化
document.addEventListener('DOMContentLoaded', function() {
    // 初次运行，处理页面上已有的代码块
    setupCodeBlockCopyButtons();
    highlightCodeBlocks();
    
    // 确保导出按钮可见
    const exportButton = document.getElementById('exportMarkdown');
    if (exportButton) {
        exportButton.style.display = 'flex';
    }
    
    // 创建观察器实例
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查新添加的节点中是否有代码块
                setupCodeBlockCopyButtons();
                highlightCodeBlocks();
            }
        });
    });
    
    // 配置观察选项
    const config = { childList: true, subtree: true };
    
    // 开始观察目标节点
    observer.observe(document.body, config);
});

// 高亮代码块，但跳过思考内容中的代码块
function highlightCodeBlocks() {
    if (window.hljs) {
        // 只处理不在思考内容中的代码块
        document.querySelectorAll('pre code:not(.thinking-content pre code)').forEach((block) => {
            // 检查是否在思考内容中
            if (!block.closest('.thinking-content')) {
                // hljs.highlightElement(block);
            }
        });
    }
}

// 将导出功能添加到每个AI消息
function addExportButtonToMessage(messageContainer) {
    // 检查是否是AI消息
    if (!messageContainer.classList.contains('ai')) {
        return;
    }
    
    // 检查是否已有导出按钮
    if (messageContainer.querySelector('.message-export-btn')) {
        return;
    }
    
    // 创建导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.className = 'message-export-btn';
    exportBtn.innerHTML = '<i class="fas fa-download"></i>';
    exportBtn.title = '导出对话';
    
    // 添加点击事件来导出当前对话
    exportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 确保全局变量currentChatMode有效
        if (typeof currentChatMode === 'undefined') {
            // 尝试从DOM确定当前模式
            const activeModeRadio = document.querySelector('input[name="chatMode"]:checked');
            if (activeModeRadio) {
                window.currentChatMode = activeModeRadio.value;
            } else {
                // 默认设为单模型模式
                window.currentChatMode = 'single';
            }
        }
        
        exportChatAsMarkdown();
    });
    
    // 添加到消息容器
    messageContainer.appendChild(exportBtn);
}

// 更新marked配置，添加语言标识
function setupMarkedOptions() {
    if (window.marked) {
        // 数学公式占位符映射（全局作用域）
        const mathMap = {};
        let mathId = 0;

        // 公式保护正则
        const displayMathRegex = /\$\$([\s\S]+?)\$\$/g;
        const latexBlockRegex = /\\\[([\s\S]+?)\\\]/g;
        const inlineMathRegex = /\$([^\$\n]+?)\$/g; // 避免跨行匹配
        const bracketBlockRegex = /^\s*\[([\s\S]+?)\]\s*$/gm;
        const bracketInlineRegex = /\[([^\[\]\n]+?)\]/g;
        const latexInlineRegex = /\\\((.+?)\\\)/g;

        // 添加安全检查，防止无限递归
        let processingCount = 0;
        const MAX_PROCESSING = 10000;

        function protectMath(src) {
            if (typeof src !== 'string') {
                console.error('protectMath接收到非字符串输入:', src);
                return '';
            }

            // 1. 先保护所有代码块和行内代码
            const codeMap = {};
            let codeId = 0;
            // ```多行代码块```
            src = src.replace(/```[\s\S]*?```/g, (m) => {
                const key = `@@CODE_BLOCK_${codeId++}@@`;
                codeMap[key] = m;
                return key;
            });
            // <pre>...</pre> 代码块
            src = src.replace(/<pre[\s\S]*?<\/pre>/gi, (m) => {
                const key = `@@CODE_BLOCK_${codeId++}@@`;
                codeMap[key] = m;
                return key;
            });
            // 行内代码 `...`
            src = src.replace(/`[^`\n]+`/g, (m) => {
                const key = `@@CODE_INLINE_${codeId++}@@`;
                codeMap[key] = m;
                return key;
            });

            // 2. 只对非代码部分做数学公式保护
            processingCount = 0;

            src = src.replace(displayMathRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_BLOCK_${mathId++}@@`;
                mathMap[key] = `$$${p1}$$`;
                return key;
            });
            src = src.replace(latexBlockRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_BLOCK_${mathId++}@@`;
                mathMap[key] = `\\[${p1}\\]`;
                return key;
            });
            src = src.replace(bracketBlockRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_BLOCK_${mathId++}@@`;
                mathMap[key] = `$$${p1}$$`;
                return key;
            });
            src = src.replace(inlineMathRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_INLINE_${mathId++}@@`;
                mathMap[key] = `\\(${p1}\\)`;
                return key;
            });
            src = src.replace(bracketInlineRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_INLINE_${mathId++}@@`;
                mathMap[key] = `\\(${p1}\\)`;
                return key;
            });
            src = src.replace(latexInlineRegex, (m, p1) => {
                if (++processingCount > MAX_PROCESSING) return m;
                const key = `@@MATH_INLINE_${mathId++}@@`;
                mathMap[key] = `\\(${p1}\\)`;
                return key;
            });

            // 3. 还原所有代码块和行内代码
            for (const key in codeMap) {
                src = src.replace(key, codeMap[key]);
            }

            return src;
        }

        // 还原函数：将占位符还原为公式（添加安全保护）
        function restoreMath(html) {
            if (typeof html !== 'string') {
                console.error('restoreMath接收到非字符串输入:', html);
                return '';
            }

            // 限制替换次数，防止无限循环
            processingCount = 0;

            for (const key in mathMap) {
                // 安全检查
                if (++processingCount > MAX_PROCESSING) {
                    console.warn('数学公式还原次数超过上限，强制中断');
                    break;
                }

                // 使用字符串方法替代正则，避免潜在的灾难性回溯
                let pos = 0;
                let result = '';
                let nextPos;

                while ((nextPos = html.indexOf(key, pos)) !== -1 && processingCount <= MAX_PROCESSING) {
                    result += html.substring(pos, nextPos) + mathMap[key];
                    pos = nextPos + key.length;
                    processingCount++;
                }

                if (pos > 0) {
                    result += html.substring(pos);
                    html = result;
                }
            }

            return html;
        }

        // 设置marked选项
        marked.setOptions({
            highlight: function(code, lang) {
                if (!code) return '';
                const language = lang && typeof lang === 'string' ? lang : '';
                if (language && hljs && hljs.getLanguage && hljs.getLanguage(language)) {
                    try {
                        return hljs.highlight(code, { language: language }).value;
                    } catch (e) {
                        console.error('语法高亮出错:', e);
                    }
                }
                return hljs && hljs.highlightAuto ? hljs.highlightAuto(code).value : code;
            },
            langPrefix: 'hljs language-',
            gfm: true,
            breaks: true,
            walkTokens: function(token) {
                // 只处理文本类型的token
                if ((token.type === 'paragraph' || token.type === 'text') && typeof token.text === 'string') {
                    token.text = protectMath(token.text);
                }
            }
        });

        // 创建自定义渲染器
        const originalRenderer = new marked.Renderer();
        const renderer = new marked.Renderer();

        renderer.code = function(code, language) {
            if (!code) return '<pre><code></code></pre>';
            if (typeof code === 'object' && code !== null) {
                code = typeof code.text === 'string' ? code.text
                    : typeof code.raw === 'string' ? code.raw
                    : '';
                language = language || code.lang || '';
            }
            if (typeof code !== 'string') {
                return `<pre><code class="hljs language-${language||''}"></code></pre>`;
            }
            let highlighted = '';
            try {
                if (window.hljs && typeof language === 'string' && language &&
                    window.hljs.getLanguage && window.hljs.getLanguage(language)) {
                    highlighted = window.hljs.highlight(code, { language }).value;
                } else if (window.hljs && window.hljs.highlightAuto) {
                    highlighted = window.hljs.highlightAuto(code).value;
                    language = '';
                } else {
                    highlighted = escapeHtml(code);
                    language = '';
                }
            } catch (e) {
                console.error('代码高亮出错:', e);
                highlighted = escapeHtml(code);
                language = '';
            }
            return `<pre><code class="hljs language-${language||''}">${highlighted}</code></pre>`;
        };

        function escapeHtml(unsafe) {
            if (typeof unsafe !== 'string') {
                try {
                    unsafe = String(unsafe);
                } catch (e) {
                    return '';
                }
            }
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        renderer.html = function(html) {
            if (html === null || html === undefined) {
                html = '';
            } else if (typeof html !== 'string') {
                try {
                    html = String(html);
                } catch (e) {
                    console.error('无法将HTML内容转换为字符串:', e);
                    html = '';
                }
            }
            // 检查是否是HTML标签
            if (html.trim && html.trim().startsWith('<') && html.trim().endsWith('>')) {
                return `<pre><code class="language-html">${escapeHtml(html)}</code></pre>`;
            }
            return originalRenderer.html(html);
        };

        marked.use({ renderer });

        // 用于还原公式的全局钩子
        const oldParse = marked.parse;
        marked.parse = function(src, ...args) {
            // 每次渲染前清空映射
            for (const k in mathMap) delete mathMap[k];
            mathId = 0;

            // 输入安全检查
            if (typeof src !== 'string') {
                console.error('marked.parse接收到非字符串输入:', src);
                return '';
            }

            try {
                // 保护公式
                const protectedSrc = protectMath(src);
                // marked 渲染
                let html = oldParse.call(marked, protectedSrc, ...args);
                // 还原公式
                html = restoreMath(html);
                return html;
            } catch (e) {
                console.error('Markdown解析错误:', e);
                // 出错时返回原始内容，确保不会完全失败
                return escapeHtml(src);
            }
        };
    }
}


// 更新思考内容而不破坏流式输出
function updateThinkingContent(container, content) {
    // 保存滚动状态
    const wasScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 5;
    
    // 保存用户焦点位置
    const activeElement = document.activeElement;
    const selection = window.getSelection();
    const ranges = [];
    for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
    }
    
    // 使用安全的方式更新内容，不使用innerHTML直接替换
    // 创建一个临时容器
    const temp = document.createElement('div');
    temp.style.display = 'none';
    temp.innerHTML = marked.parse(content);
    document.body.appendChild(temp);
    
    // 清空容器但保留它自己
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // 将解析后的内容复制到容器中
    while (temp.firstChild) {
        container.appendChild(temp.firstChild);
    }
    
    // 移除临时容器
    document.body.removeChild(temp);
    
    // 还原用户焦点
    if (activeElement) {
        activeElement.focus();
        if (selection && ranges.length) {
            selection.removeAllRanges();
            ranges.forEach(range => selection.addRange(range));
        }
    }
    
    // 处理代码块的复制按钮
    setupCodeBlockCopyButtons();
    
    // 恢复滚动位置
    if (wasScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
    }
}

// 在接收到AI响应时处理思考内容
function handleThinkingContent(thinking, messageContainer) {
    // 使用ThinkingHandler处理思考内容
    if (thinking && thinking.trim() !== '') {
        thinkingHandler.handleThinking(thinking, messageContainer);
    }
}


/**
 * 导出讨论组对话为Markdown
 * 专门针对讨论组模式优化的导出功能
 */
function exportGroupDiscussion() {
    // console.log('开始导出讨论组对话为Markdown文件');
    
    // 获取当前讨论组信息
    const groupId = discussionGroupSelect.value;
    const groupOption = discussionGroupSelect.options[discussionGroupSelect.selectedIndex];
    const groupName = groupOption ? groupOption.textContent : '未知讨论组';
    
    // 获取讨论主题
    let discussionTopic = '未设置主题';
    const topicElement = document.getElementById('discussionTopic');
    if (topicElement && topicElement.value) {
        discussionTopic = topicElement.value;
    } else {
        // 如果没有找到discussionTopic元素或其值为空，尝试从页面中的讨论主题元素获取
        const topicEl = document.querySelector('.discussion-topic');
        if (topicEl) {
            discussionTopic = topicEl.textContent || '未设置主题';
        }
    }
    
    // 创建Markdown文本
    let markdownContent = `# DeepGemini 讨论组记录\n\n`;
    markdownContent += `导出时间: ${new Date().toLocaleString()}\n\n`;
    markdownContent += `讨论组: ${groupName}\n\n`;
    markdownContent += `讨论主题: ${discussionTopic}\n\n`;
    markdownContent += `---\n\n`;
    
    // 获取聊天容器
    const chatContainer = document.getElementById('chatMessages');
    
    // 先检查是否有主题的显示元素
    const topicEl = chatContainer.querySelector('.discussion-topic');
    if (topicEl) {
        const topicTitle = topicEl.textContent || '未识别主题';
        markdownContent += `## ${topicTitle}\n\n`;
    }
    
    let hasContent = false;
    let messagesForExport = [];
    
    // 新方法：按DOM顺序收集所有消息
    
    // 1. 首先检查讨论轮次结构
    const discussionRounds = chatContainer.querySelectorAll('.discussion-round');
    if (discussionRounds.length > 0) {
        hasContent = true;
        // 对于每个讨论轮次
        discussionRounds.forEach((round, roundIndex) => {
            // 获取轮次标题
            const roundTitle = round.querySelector('.discussion-round-title');
            const title = roundTitle ? roundTitle.textContent : `讨论轮次 ${roundIndex + 1}`;
            
            // 添加轮次信息
            messagesForExport.push({
                type: 'round-title',
                title: title,
                roundIndex: roundIndex
            });
            
            // 获取该轮次内的所有消息
            const agentMessages = round.querySelectorAll('.agent-message');
            agentMessages.forEach(message => {
                if (message.classList.contains('waiting-human')) return; // 跳过等待状态
                
                // 获取角色名称和角色标签
                const nameEl = message.querySelector('.agent-name');
                const name = nameEl ? nameEl.textContent : '参与者';
                
                const badgeEl = message.querySelector('.agent-badge');
                const badge = badgeEl ? badgeEl.textContent : '';
                
                // 获取消息内容
                const contentEl = message.querySelector('.agent-content');
                if (!contentEl) return;
                
                // 检查内容是否为"等待人类输入..."
                if (contentEl.textContent.trim() === "等待人类输入...") return;
                
                // 将消息添加到数组
                messagesForExport.push({
                    type: 'agent',
                    name: name,
                    badge: badge,
                    content: contentEl.innerHTML,
                    element: message,
                    roundIndex: roundIndex
                });
                });
                
            // 添加轮次分隔符
            messagesForExport.push({
                type: 'separator',
                roundIndex: roundIndex
            });
        });
    } else {
        // 2. 如果没有轮次结构，收集独立的agent-message
        const agentMessages = chatContainer.querySelectorAll('.agent-message');
        if (agentMessages.length > 0) {
            hasContent = true;
            agentMessages.forEach((message, index) => {
                if (message.classList.contains('waiting-human')) return; // 跳过等待状态
                
                // 获取角色名称和角色标签
                const nameEl = message.querySelector('.agent-name');
                const name = nameEl ? nameEl.textContent : '参与者';
                
                const badgeEl = message.querySelector('.agent-badge');
                const badge = badgeEl ? badgeEl.textContent : '';
                
                // 获取消息内容
                const contentEl = message.querySelector('.agent-content');
                if (!contentEl) return;
                
                // 检查内容是否为"等待人类输入..."
                if (contentEl.textContent.trim() === "等待人类输入...") return;
                
                // 将消息添加到数组
                messagesForExport.push({
                    type: 'agent',
                    name: name,
                    badge: badge,
                    content: contentEl.innerHTML,
                    element: message,
                    index: index
                });
            });
        }
    }
    
    // 3. 收集普通的message-container消息（包括用户消息）
        const messageContainers = chatContainer.querySelectorAll('.message-container');
        if (messageContainers.length > 0) {
            hasContent = true;
        messageContainers.forEach((container, index) => {
                // 跳过欢迎消息
            if (container.classList.contains('welcome-message')) return;
                
                // 获取消息角色和名称
                const role = container.classList.contains('ai') ? 'AI' : 
                             container.classList.contains('user') ? '用户' : 
                             container.classList.contains('system') ? '系统' : '其他';
                             
                const nameElement = container.querySelector('.message-name');
                const name = nameElement ? nameElement.textContent : role;
                
                // 获取消息内容
                const contentElement = container.querySelector('.message-content');
                if (!contentElement) return;
                
            // 将消息添加到数组
            messagesForExport.push({
                type: 'message',
                role: role,
                name: name,
                content: contentElement.innerHTML,
                element: container,
                index: index
            });
        });
    }
    
    // 如果没有任何内容，添加说明
    if (!hasContent || messagesForExport.length === 0) {
        markdownContent += `*暂无讨论内容*\n\n`;
    } else {
        // 按照DOM顺序排序消息
        // 使用compareDocumentPosition API来比较元素在DOM中的位置
        messagesForExport.sort((a, b) => {
            // 如果是轮次标题或分隔符，按轮次索引排序
            if ((a.type === 'round-title' || a.type === 'separator') && 
                (b.type === 'round-title' || b.type === 'separator')) {
                return a.roundIndex - b.roundIndex;
            }
            
            // 轮次标题始终排在其轮次的消息之前
            if (a.type === 'round-title' && a.roundIndex === b.roundIndex) {
                return -1;
            }
            
            // 轮次分隔符始终排在其轮次的消息之后
            if (a.type === 'separator' && a.roundIndex === b.roundIndex) {
                return 1;
            }
            
            // 如果没有DOM元素，则按索引排序
            if (!a.element || !b.element) {
                if (a.roundIndex !== undefined && b.roundIndex !== undefined) {
                    return a.roundIndex - b.roundIndex;
                }
                return (a.index || 0) - (b.index || 0);
            }
            
            // 使用compareDocumentPosition比较DOM位置
            const position = a.element.compareDocumentPosition(b.element);
            
            // 检查是否前后关系
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                return -1; // a在b之前
            }
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                return 1;  // a在b之后
            }
            return 0; // 相同位置（不太可能发生）
                });
                
        // 添加统一的讨论内容标题
        markdownContent += `## 讨论内容\n\n`;
        
        // 处理排序后的消息
        let currentRoundIndex = -1;
        messagesForExport.forEach(msg => {
            switch (msg.type) {
                case 'round-title':
                    markdownContent += `### ${msg.title}\n\n`;
                    currentRoundIndex = msg.roundIndex;
                    break;
                    
                case 'separator':
                    markdownContent += `---\n\n`;
                    break;
                    
                case 'agent':
                    let header = `#### ${msg.name}`;
                    if (msg.badge) {
                        header += ` (${msg.badge})`;
                    }
                    
                    // 处理消息内容
                    let content = processContentToMarkdown(msg.content);
                
                // 添加到Markdown文本
                    markdownContent += `${header}\n\n${content}\n\n`;
                    break;
                    
                case 'message':
                    let msgHeader = `#### ${msg.name}`;
                    // 处理消息内容
                    let msgContent = processContentToMarkdown(msg.content);
                    
                    // 添加到Markdown文本
                    markdownContent += `${msgHeader}\n\n${msgContent}\n\n`;
                    break;
            }
        });
    }
    
    // 创建下载链接
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // 设置文件名
    const fileName = `deepgemini-discussion-${groupName.replace(/\s+/g, '-')}-${Date.now()}.md`;
    link.download = fileName;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 动态插入导出按钮
function insertExportButtonToSummary() {
    // 只查找最新的 summary-message
    const summaryMsg = document.querySelector('.agent-message.summary-message');
    if (!summaryMsg) return;
    if (summaryMsg.querySelector('#exportGroupChatBtn')) return;

    const exportBtn = document.createElement('button');
    exportBtn.id = 'exportGroupChatBtn';
    exportBtn.className = 'btn btn-export-discussion-icon';
    exportBtn.title = '导出讨论为Markdown';
    exportBtn.innerHTML = '<i class="fas fa-file-export"></i>';
    exportBtn.onclick = exportGroupDiscussion;

    summaryMsg.appendChild(exportBtn);
}

// 辅助函数：将HTML内容转换为Markdown
function processContentToMarkdown(htmlContent) {
    let content = htmlContent;
    
    // 创建一个临时div来处理HTML内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // 处理代码块
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const language = block.className.replace('language-', '').replace('dark-code', '').trim() || '';
        const code = block.textContent;
        const codeMarkdown = `\`\`\`${language}\n${code}\n\`\`\``;
    
        // 在内容中替换代码块
        content = content.replace(block.parentNode.outerHTML, codeMarkdown);
    });
    
    // 简单处理HTML转Markdown
    content = content
        .replace(/<\/?p>/g, '\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/?strong>/g, '**')
        .replace(/<\/?em>/g, '_')
        .replace(/<\/?code>/g, '`')
        .replace(/<\/?[^>]+(>|$)/g, '') // 删除其他HTML标签
        .trim();
        
    return content;
}

// 侧边栏展开/收起功能
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        // 可选：切换图标方向
        const toggleIcon = sidebar.querySelector('.sidebar-toggle i');
        if (toggleIcon) {
            toggleIcon.classList.toggle('fa-chevron-left');
            toggleIcon.classList.toggle('fa-chevron-right');
        }
    }
}

//
function processMathJax(messageContent) {
    if (window.MathJax && window.MathJax.typesetPromise) {
        if (window.MathJax.typesetClear) {
            window.MathJax.typesetClear([messageContent]);
        }
        window.MathJax.typesetPromise([messageContent]).then(() => {
            messageContent.setAttribute('data-mathjax-processed', 'true');
        });
    }
}