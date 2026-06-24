import type { WorkplaceScenario } from '@/types/workplaceScenario';

export const mockWorkplaceScenarios: WorkplaceScenario[] = [
  {
    slug: 'daily-standup',
    title: 'Daily Standup',
    titleZh: '每日站会',
    description: 'Yesterday / Today / Blockers — concise updates.',
    descriptionZh: '昨天 / 今天 / 阻碍 —— 简洁的每日更新。',
    level: 'B1',
    progress: 35,
    estimatedTime: '15 min',
    objective: 'Give a clear 60-second standup update in English.',
    objectiveZh: '用英语给出清晰的 60 秒站会更新。',
    context: 'In daily standups, each team member answers three questions: What did I do yesterday? What will I do today? What blockers do I have? The goal is to be concise and clear.',
    contextZh: '在每日站会中，每个团队成员回答三个问题：我昨天做了什么？我今天要做什么？我有什么阻碍？目标是简洁明了。',
    sentencePatterns: [
      { pattern: 'Yesterday, I worked on [task].', meaningZh: '昨天我做了[任务]。', example: 'Yesterday, I worked on the user authentication module.' },
      { pattern: 'Today, I will focus on [task].', meaningZh: '今天我专注于[任务]。', example: 'Today, I will focus on writing unit tests for the payment service.' },
      { pattern: 'I am blocked by [issue], so I need [help].', meaningZh: '我被[问题]阻碍，需要[帮助]。', example: 'I am blocked by a missing API endpoint, so I need the backend team to deploy the latest version.' },
      { pattern: 'I plan to finish [task] by [time].', meaningZh: '我计划在[时间]前完成[任务]。', example: 'I plan to finish the database migration by end of day.' },
    ],
    usefulPhrases: [
      { en: 'Quick update on what I did yesterday…', zh: '快速更新一下我昨天做了什么……', usage: 'Opening a standup update' },
      { en: 'I made progress on [feature].', zh: '我在[功能]上取得了进展。', usage: 'Reporting progress' },
      { en: 'I need some input on [issue].', zh: '我在[问题]上需要一些建议。', usage: 'Requesting help' },
      { en: 'No blockers from my side.', zh: '我这没有阻碍。', usage: 'When everything is on track' },
    ],
    miniDrills: [
      { id: 'standup-1', prompt: 'Write a 3-sentence standup update.', promptZh: '写一个 3 句话的站会更新。', sampleAnswer: 'Yesterday, I worked on fixing the login timeout issue. Today, I will start implementing the password reset flow. I am blocked by the design team not having finalized the UI mockups yet.' },
      { id: 'standup-2', prompt: 'You are stuck. How do you communicate that?', promptZh: '你遇到了阻碍，如何表达？', sampleAnswer: 'I am blocked by the database migration script failing in staging. I need DevOps to help check the permissions on the staging environment.' },
    ],
    toneTips: [
      { title: 'Be concise', titleZh: '简洁', detail: 'Aim for 30-60 seconds. Focus on progress, plans, and blockers.', detailZh: '目标 30-60 秒。聚焦于进展、计划和阻碍。' },
      { title: 'Be specific', titleZh: '具体', detail: 'Instead of "working on bugs", say "fixing the login timeout issue in the auth service."', detailZh: '不要只说"改 bug"，要具体说"修复 auth 服务中的登录超时问题"。' },
      { title: 'Ask for help clearly', titleZh: '清晰求助', detail: 'State what you need and from whom: "I need [name] to help with [specific ask]."', detailZh: '说明你需要什么、需要谁帮助："我需要[谁]协助[具体事项]"。' },
    ],
    commonMistakes: ['Being too vague ("working on stuff")', 'Not mentioning blockers', 'Going over 2 minutes', 'Using overly technical jargon that non-tech teammates may not understand'],
    relatedTopics: ['restful-api', 'database'],
  },
  {
    slug: 'writing-emails',
    title: 'Writing Emails',
    titleZh: '邮件写作',
    description: 'Status updates, requests, follow-ups.',
    descriptionZh: '状态更新、请求、跟进。',
    level: 'B1+',
    progress: 20,
    estimatedTime: '20 min',
    objective: 'Write clear, professional work emails in English.',
    objectiveZh: '用英语写出清晰、专业的职场邮件。',
    context: 'Work emails should be clear and concise. Start with a clear subject line, state the purpose in the first sentence, provide necessary details, and end with a clear call to action when needed.',
    contextZh: '工作邮件应清晰简洁。以明确的主题行开头，在第一句说明目的，提供必要的细节，必要时以明确的行动号召结尾。',
    sentencePatterns: [
      { pattern: 'I am writing to follow up on [topic].', meaningZh: '我写信是为了跟进[主题]。', example: 'I am writing to follow up on the deployment schedule for next week.' },
      { pattern: 'Could you please confirm [detail]?', meaningZh: '你能确认一下[细节]吗？', example: 'Could you please confirm the deadline for the Q2 release?' },
      { pattern: 'Here is a quick update on [project].', meaningZh: '以下是关于[项目]的快速更新。', example: 'Here is a quick update on the API migration project.' },
      { pattern: 'Please let me know if you have any questions.', meaningZh: '如有任何问题请告诉我。', example: 'Please let me know if you have any questions about the attached document.' },
    ],
    usefulPhrases: [
      { en: 'I am writing to update you on…', zh: '我写信是为了更新……', usage: 'Starting an update email' },
      { en: 'As per our conversation…', zh: '根据我们的讨论……', usage: 'Referring to a previous discussion' },
      { en: 'Please find attached the [document].', zh: '请查收附件中的[文档]。', usage: 'Sharing attachments' },
      { en: 'Looking forward to your reply.', zh: '期待你的回复。', usage: 'Ending an email politely' },
    ],
    miniDrills: [
      { id: 'email-1', prompt: 'Write a short email asking for a deadline extension.', promptZh: '写一封简短的邮件，请求延期截止日期。', sampleAnswer: 'Subject: Request for deadline extension\n\nHi [Name],\n\nI am writing to request a 2-day extension on the API documentation task due to unexpected complexity in the authentication flow. I will have it completed by Thursday EOD.\n\nPlease let me know if this works.\n\nBest,\n[Your Name]' },
      { id: 'email-2', prompt: 'Write a follow-up email after a meeting.', promptZh: '写一个会后跟进邮件。', sampleAnswer: 'Subject: Follow-up on today\'s sprint planning\n\nHi team,\n\nThank you for the productive discussion today. Here is a summary of what we agreed on:\n- Complete user story #45 by Friday\n- Start sprint review prep next Monday\n\nPlease let me know if I missed anything.\n\nBest,\n[Your Name]' },
    ],
    toneTips: [
      { title: 'Clear subject line', titleZh: '清晰的标题', detail: 'The subject should tell the reader what the email is about and what action is needed.', detailZh: '主题行应告诉读者邮件内容以及需要什么行动。' },
      { title: 'Short paragraphs', titleZh: '短段落', detail: 'Keep paragraphs to 2-3 sentences. Use bullet points for lists.', detailZh: '每段保持 2-3 句话。列表使用项目符号。' },
      { title: 'Professional closing', titleZh: '专业结尾', detail: 'End with a clear next step: "I look forward to your feedback" or "Let me know if you need more details."', detailZh: '以明确的下一步结尾："期待你的反馈"或"如需更多信息请告诉我"。' },
    ],
    commonMistakes: ['No subject line or vague subject', 'Too long without a clear purpose', 'Using informal language in formal contexts', 'Not including a call to action'],
    relatedTopics: [],
  },
  {
    slug: 'code-review',
    title: 'Code Review',
    titleZh: '代码评审',
    description: 'Leave clear, polite review comments.',
    descriptionZh: '留下清晰、有礼貌的评审意见。',
    level: 'B2',
    progress: 12,
    estimatedTime: '20 min',
    objective: 'Give constructive code review feedback in English.',
    objectiveZh: '用英语给出有建设性的代码评审反馈。',
    context: 'Code review is a key part of the development workflow. Comments should be constructive, specific, and respectful. Focus on the code, not the person. Suggest improvements rather than demanding changes.',
    contextZh: '代码评审是开发流程的关键部分。评论应有建设性、具体且尊重他人。关注代码而非个人。提出改进建议而非要求修改。',
    sentencePatterns: [
      { pattern: 'Could we consider [approach] instead?', meaningZh: '我们可以考虑用[方法]代替吗？', example: 'Could we consider using a cache layer instead of querying the database each time?' },
      { pattern: 'This looks good overall. One small suggestion is [suggestion].', meaningZh: '整体看起来不错。一个小建议是[建议]。', example: 'This looks good overall. One small suggestion is to extract this logic into a helper function.' },
      { pattern: 'I think this could be simplified by [change].', meaningZh: '我认为可以通过[修改]来简化。', example: 'I think this could be simplified by using a early return pattern here.' },
      { pattern: 'Nit: [minor suggestion]', meaningZh: '小建议：[小建议]', example: 'Nit: consider renaming this variable to something more descriptive.' },
    ],
    usefulPhrases: [
      { en: 'Have you considered [alternative]?', zh: '你有没有考虑过[替代方案]？', usage: 'Suggesting an alternative approach' },
      { en: 'This approach works, but we might want to…', zh: '这个方法可行，但我们可能需要……', usage: 'Acknowledging while suggesting improvement' },
      { en: 'Great job on [part]! One thing to watch out for is…', zh: '[部分]做得好！需要注意的一点是……', usage: 'Positive feedback + suggestion' },
      { en: 'LGTM (Looks Good To Me)', zh: '看起来没问题', usage: 'Approving a change' },
    ],
    miniDrills: [
      { id: 'cr-1', prompt: 'Write a polite comment suggesting a code change.', promptZh: '写一个礼貌的建议代码修改的评论。', sampleAnswer: 'This implementation works well. One suggestion: could we use dependency injection here instead of creating the service instance directly? This would make it easier to unit test.' },
      { id: 'cr-2', prompt: 'You found a potential bug. How do you flag it?', promptZh: '你发现了一个潜在的 bug，如何提出？', sampleAnswer: 'I noticed a potential issue on line 45 — the null check happens after the method call, which could cause a NullPointerException. Should we move the check before the call?' },
    ],
    toneTips: [
      { title: 'Focus on the code', titleZh: '关注代码', detail: 'Say "this function might be clearer if…" not "you should…"', detailZh: '说"这个函数如果……可能更清晰"，而不是"你应该……"' },
      { title: 'Start with praise', titleZh: '先肯定', detail: 'Begin with something positive before suggesting improvements.', detailZh: '在提出改进建议之前先肯定一些积极的东西。' },
      { title: 'Use questions', titleZh: '用提问的方式', detail: '"What do you think about…?" is more collaborative than "This should be…"', detailZh: '"你觉得……怎么样？"比"这应该……"更有协作性。' },
    ],
    commonMistakes: ['Being overly critical or personal', 'Not explaining why a change is needed', 'Nitpicking without prioritizing', 'Using aggressive language ("this is wrong", "fix this")'],
    relatedTopics: ['restful-api', 'database', 'docker'],
  },
  {
    slug: 'meetings-clarification',
    title: 'Meetings & Clarification',
    titleZh: '会议与澄清',
    description: 'Ask for clarification without losing face.',
    descriptionZh: '在不丢面的情况下请求澄清。',
    level: 'B1',
    progress: 8,
    estimatedTime: '15 min',
    objective: 'Ask clarifying questions and confirm understanding in meetings.',
    objectiveZh: '在会议中提出澄清问题并确认理解。',
    context: 'In meetings, it\'s important to speak up when something is unclear. Using polite phrases to ask for clarification shows engagement, not weakness. Confirm your understanding to avoid misalignment.',
    contextZh: '在会议中，当有不明确的地方时及时提出很重要。使用礼貌用语请求澄清表明你的投入，而非弱点。确认你的理解以避免误解。',
    sentencePatterns: [
      { pattern: 'Could you clarify what you mean by [term]?', meaningZh: '你能澄清一下你说的[术语]是什么意思吗？', example: 'Could you clarify what you mean by "zero-downtime deployment" in this context?' },
      { pattern: 'Just to make sure I understood correctly, [paraphrase].', meaningZh: '为了确认我理解正确，[转述]。', example: 'Just to make sure I understood correctly, you want the API to return a 202 status instead of 200 for async operations?' },
      { pattern: 'Can we align on the next steps?', meaningZh: '我们能对齐一下下一步吗？', example: 'Can we align on the next steps before we wrap up?' },
      { pattern: 'Could you walk me through that part again?', meaningZh: '你能再讲一下那部分吗？', example: 'Could you walk me through the authentication flow again? I want to make sure I understand the token refresh mechanism.' },
    ],
    usefulPhrases: [
      { en: 'If I understand correctly, [paraphrase].', zh: '如果我理解正确的话，[转述]。', usage: 'Confirming understanding' },
      { en: 'Could you elaborate on that point?', zh: '你能详细说一下那一点吗？', usage: 'Asking for more detail' },
      { en: 'Let me play back what I heard…', zh: '我来复述一下我听到的……', usage: 'Verifying understanding' },
      { en: 'I want to make sure we are on the same page.', zh: '我想确认我们达成共识。', usage: 'Ensuring alignment' },
    ],
    miniDrills: [
      { id: 'meeting-1', prompt: 'Someone used a technical term you don\'t know. Ask for clarification.', promptZh: '有人用了一个你不懂的技术术语。请求澄清。', sampleAnswer: 'Sorry, could you clarify what you mean by "eventual consistency" in this context? I want to make sure I understand the trade-offs we are discussing.' },
      { id: 'meeting-2', prompt: 'Restate what was discussed to confirm understanding.', promptZh: '复述讨论内容以确认理解。', sampleAnswer: 'Just to make sure I understood correctly, we agreed to split the migration into two phases: first the database upgrade, then the service refactor. Is that right?' },
    ],
    toneTips: [
      { title: 'Polite clarification', titleZh: '礼貌澄清', detail: '"Could you clarify…" is more polite than "What does… mean?" especially in group settings.', detailZh: '"Could you clarify……"比"What does……mean?"更礼貌，尤其是在集体场合。' },
      { title: 'Show engagement', titleZh: '展示投入', detail: 'Asking questions shows you are engaged. It\'s better to ask than to pretend you understood.', detailZh: '提问表明你在投入。与其假装理解，不如提问。' },
      { title: 'Summarize at the end', titleZh: '最后总结', detail: 'At the end of a discussion, summarize key decisions to confirm alignment.', detailZh: '在讨论结束时，总结关键决定以确认一致。' },
    ],
    commonMistakes: ['Not asking when something is unclear', 'Asking aggressively ("That doesn\'t make sense")', 'Repeating the same question multiple times', 'Not taking notes during clarification'],
    relatedTopics: ['restful-api'],
  },
];

export function getWorkplaceScenarios(): WorkplaceScenario[] {
  return mockWorkplaceScenarios;
}

export function getWorkplaceScenarioBySlug(slug: string): WorkplaceScenario | undefined {
  return mockWorkplaceScenarios.find((s) => s.slug === slug);
}
