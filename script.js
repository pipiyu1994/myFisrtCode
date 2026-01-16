// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const nameInput = document.getElementById('name');
    const positionSelect = document.getElementById('position');
    const sceneRadios = document.querySelectorAll('input[name="scene"]');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultModal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalFortuneRating = document.getElementById('modal-fortune-rating');
    const modalCoreMessage = document.getElementById('modal-core-message');
    const modalSolution = document.getElementById('modal-solution');
    
    // 风水评级列表
    const fortuneRatings = [
        '上上签·工位锦鲤',
        '上中签·职场顺风',
        '中签·稳如老狗',
        '下中签·渡劫中',
        '下下签·渡劫预警'
    ];
    
    // 岗位相关的核心话术模板
    const messageTemplates = {
        '程序猿': {
            '工位布局': '作为程序猿，您的工位布局至关重要。代码质量与工位气场息息相关，一个好的布局能让您bug少，效率高。',
            '摸鱼安全': '程序猿的摸鱼技巧需要与工位环境完美结合，合理的遮挡和专注的假象能让您摸鱼更安心。',
            '加班概率': '代码复杂度与加班时间成正比，您的工位气场将影响代码的顺畅度，从而间接影响加班概率。',
            '加薪潜力': '技术能力是加薪的基础，但工位风水能为您加分不少，良好的气场能让您的努力被领导看见。',
            'BUG规避': '代码中的bug往往与程序员的状态有关，工位风水能调整您的状态，减少低级错误的发生。'
        },
        '产品狗': {
            '工位布局': '产品经理的工位需要充满创意气息，合理的布局能让您灵感迸发，需求文档质量更高。',
            '摸鱼安全': '产品经理的摸鱼需要更隐蔽，工位的位置和环境能为您提供更好的掩护。',
            '加班概率': '需求变更频率与加班时间直接相关，工位风水能帮助您更好地预测和应对变更。',
            '加薪潜力': '产品的成功是加薪的关键，工位气场能提升您的产品敏感度，让您更准确地把握用户需求。',
            'BUG规避': '产品需求的清晰度直接影响bug数量，工位风水能让您思路更清晰，减少需求歧义。'
        },
        '运营喵': {
            '工位布局': '运营岗位需要信息流通顺畅，工位的位置和布局能让您更好地获取和传递信息。',
            '摸鱼安全': '运营工作的灵活性需要与工位环境相匹配，合理的布局能让您的工作更有弹性。',
            '加班概率': '活动策划和执行的强度直接影响加班时间，工位风水能提升您的执行力，减少加班。',
            '加薪潜力': '运营效果是加薪的重要指标，工位气场能提升您的创意和执行力，让活动效果更佳。',
            'BUG规避': '运营活动的细节决定成败，工位风水能让您更细心，减少活动中的失误。'
        },
        '设计狮': {
            '工位布局': '设计师的工位需要充满艺术气息，合理的布局能激发您的创意灵感，设计作品更出色。',
            '摸鱼安全': '设计师的工作状态需要安静的环境，工位的位置和布局能为您提供更好的创作空间。',
            '加班概率': '设计修改的频率与加班时间成正比，工位风水能提升您的设计一次性通过率。',
            '加薪潜力': '设计作品的质量是加薪的关键，工位气场能让您的设计更有灵性，打动客户和领导。',
            'BUG规避': '设计稿的细节决定了后续开发的顺畅度，工位风水能让您更注重细节，减少设计问题。'
        },
        '其他': {
            '工位布局': '您的工位布局对工作效率有着重要影响，合理的安排能让您的工作更得心应手。',
            '摸鱼安全': '无论什么岗位，适当的休息都是必要的，工位的位置能让您的休息更安心。',
            '加班概率': '工作强度和效率直接影响加班时间，工位风水能提升您的工作效率，减少加班。',
            '加薪潜力': '工作表现是加薪的基础，工位气场能让您的努力被更多人看见，提升加薪机会。',
            'BUG规避': '任何工作都需要细心和专注，工位风水能调整您的状态，减少工作中的失误。'
        }
    };
    
    // 化解建议列表
    const solutions = [
        '今日工位忌放奶茶，换绿植可提升摸鱼安全感',
        '工位左侧摆放小摆件，有助于提升代码质量',
        '桌面保持整洁，减少杂物堆积，可降低加班概率',
        '在工位角落放置一小盆多肉植物，能提升加薪潜力',
        '电脑屏幕亮度调至适中，可减少眼部疲劳，提高工作效率',
        '工位附近避免放置尖锐物品，有助于减少与人争执',
        '每天早上整理工位5分钟，能为一天的工作带来好运',
        '工位上方避免横梁压顶，可调整座椅位置规避',
        '保持工位通风良好，新鲜空气能提升创意灵感',
        '在工位显眼处放置激励自己的小标语，有助于保持工作动力'
    ];
    
    // 模拟大模型API调用函数
    function callLLMAPI(name, position, scene) {
        // 构建指令
        const prompt = `作为一个趣味风水大师，请为${name}（${position}）进行${scene}的风水测算。
        请提供：
        1. 风水评级（如"上上签·工位锦鲤""中平签·稳如老狗""下下签·渡劫预警"）
        2. 核心话术（适配${position}和${scene}场景）
        3. 化解建议（趣味版）`;
        
        console.log('调用大模型API，提示词：', prompt);
        
        // 模拟API返回结果
        return new Promise((resolve) => {
            setTimeout(() => {
                // 随机生成风水评级
                const randomRating = fortuneRatings[Math.floor(Math.random() * fortuneRatings.length)];
                
                // 根据岗位和场景获取核心话术
                const message = messageTemplates[position][scene];
                
                // 随机生成化解建议
                const randomSolution = solutions[Math.floor(Math.random() * solutions.length)];
                
                resolve({
                    rating: randomRating,
                    message: message,
                    solution: randomSolution
                });
            }, 1000); // 模拟1秒的API响应时间
        });
    }
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', async function() {
        // 获取用户输入
        const name = nameInput.value || '打工人';
        const position = positionSelect.value;
        let scene = '工位布局'; // 默认场景
        
        // 获取选中的场景
        sceneRadios.forEach(radio => {
            if (radio.checked) {
                scene = radio.value;
            }
        });
        
        // 显示加载状态
        calculateBtn.textContent = '测算中...';
        calculateBtn.disabled = true;
        
        try {
            // 调用大模型API
            const result = await callLLMAPI(name, position, scene);
            
            // 更新弹窗内容
            modalFortuneRating.textContent = result.rating;
            modalCoreMessage.innerHTML = `<strong>核心话术：</strong>${result.message}`;
            modalSolution.innerHTML = `<strong>化解建议：</strong>${result.solution}`;
            
            // 显示弹窗
            resultModal.classList.remove('hidden');
        } catch (error) {
            console.error('测算失败：', error);
            alert('测算失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            calculateBtn.textContent = '开始测算';
            calculateBtn.disabled = false;
        }
    });
    
    // 关闭弹窗按钮点击事件
    closeModalBtn.addEventListener('click', function() {
        resultModal.classList.add('hidden');
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        // 隐藏弹窗
        resultModal.classList.add('hidden');
        
        // 重置表单
        nameInput.value = '打工人';
        positionSelect.value = '程序猿';
        sceneRadios[0].checked = true; // 默认选中第一个场景
    });
    
    // 点击弹窗外部关闭弹窗
    resultModal.addEventListener('click', function(e) {
        if (e.target === resultModal) {
            resultModal.classList.add('hidden');
        }
    });
});