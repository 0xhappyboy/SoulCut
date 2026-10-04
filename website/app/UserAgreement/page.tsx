"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useI18n } from "@/app/providers/I18nProvider";
// Bilingual clause helper: every clause carries a Chinese and English version.
type Clause = { zh: string; en: string };
// Section structure used across the agreement.
interface Section {
  id: string;
  title: Clause;
  body: Clause[];
}
// Brand name: Chinese locale shows "剪灵", English locale shows "SoulCut".
// They are never displayed together.
const OPERATOR: Clause = {
  zh: "剪灵",
  en: "SoulCut",
};
const CONTACT_EMAIL = "support@soulcut.app";
const OFFICIAL_SITE = "soulcut.app";
const sections: Section[] = [
  {
    id: "intro",
    title: {
      zh: "导言",
      en: "Introduction",
    },
    body: [
      {
        zh: `《剪灵用户服务协议》（以下称"本协议"）是您与 ${OPERATOR.zh} 之间就您下载、安装、打开、使用（以下统称"使用"）剪灵的相关事宜约定双方权利义务的协议。`,
        en: `This SoulCut Terms of Service (the "Agreement") is entered into between you and ${OPERATOR.en} regarding your download, installation, opening, and use (collectively, "use") of SoulCut.`,
      },
      {
        zh: "请您在开始使用剪灵之前，认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款、限制用户权利的条款、权利许可和信息使用的条款、法律适用和争议解决条款等。如您未满 18 周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并在征得法定监护人同意后使用剪灵。",
        en: "Please read and fully understand this Agreement before you start using SoulCut, especially the clauses on exemption or limitation of liability, restriction of user rights, rights licensing and information use, and governing law and dispute resolution. If you are under 18, please read this Agreement carefully with your legal guardian and use SoulCut only with your guardian's consent.",
      },
      {
        zh: `当您使用剪灵，则视为您已详细阅读并充分理解本协议，同意作为本协议的一方当事人接受本协议的约束。如您不同意本协议，可以选择不使用剪灵。如对本协议内容有任何疑问、意见或建议，您可通过 ${CONTACT_EMAIL} 与我们联系。`,
        en: `By using SoulCut, you are deemed to have read and fully understood this Agreement and agreed to be bound by it. If you do not agree, you may choose not to use SoulCut. If you have any questions, comments, or suggestions, you may contact us at ${CONTACT_EMAIL}.`,
      },
    ],
  },
  {
    id: "service",
    title: {
      zh: "剪灵产品及服务",
      en: "SoulCut Products and Services",
    },
    body: [
      {
        zh: "剪灵是一款非线性视频剪辑软件，为每一帧注入灵魂。您可通过官方网站或我们授权的渠道获取剪灵客户端。若您并非从上述正规途径获取剪灵产品或服务的，我们无法保证该版本为官方版本，亦不能保障相关版本的剪灵能够正常使用。",
        en: "SoulCut is a nonlinear video editing software that breathes soul into every frame. You may obtain the SoulCut client through the official website or authorized channels. If you obtain SoulCut from a non-official source, we cannot guarantee that it is an official build or that it will function properly.",
      },
      {
        zh: "您使用剪灵需自行准备如电脑等相关终端设备，并自行承担所需要的上网费、流量费等费用。",
        en: "You are responsible for preparing your own device, such as a computer, and for any internet or data fees incurred while using SoulCut.",
      },
      {
        zh: "我们许可您一项个人的、可撤销的、不可转让的、非独占的和非商业的合法使用剪灵的权利。本协议未明示授权的其他一切权利仍由我们保留。除非得到我们事先明示的书面授权，您不得以任何未经授权的形式使用剪灵，包括但不限于改编、复制、传播、爬虫、垂直搜索、镜像或交易等。",
        en: "We grant you a personal, revocable, non-transferable, non-exclusive, and non-commercial license to use SoulCut. All rights not expressly granted in this Agreement are reserved. Unless you have our prior written authorization, you may not use SoulCut in any unauthorized manner, including adaptation, reproduction, distribution, crawling, vertical search, mirroring, or trading.",
      },
      {
        zh: "为提升用户体验，或基于整体服务运营、平台安全、合规经营的需要，我们可能不定期更新或变更剪灵产品或服务，包括但不限于修改、升级、中止或终止相关服务、提供新服务或软件包替换等。",
        en: "To improve user experience or for operational, security, or compliance reasons, we may update or change SoulCut products or services from time to time, including modifying, upgrading, suspending, or terminating services, or providing new services or software packages.",
      },
      {
        zh: "剪灵为闭源软件，但可免费使用。您可以免费下载并使用其全部功能，源代码不对外公开。",
        en: "SoulCut is closed-source software, but it is free to use. You may download and use all of its features at no cost, and the source code is not publicly available.",
      },
    ],
  },
  {
    id: "content",
    title: {
      zh: "信息内容发布规范",
      en: "Content Publishing Rules",
    },
    body: [
      {
        zh: "我们致力于提供文明、理性、友善、高质量的交流平台。您可以使用剪灵制作、发布视频、图片、文字等信息内容，并保证所发布信息内容（无论是否公开）符合法律法规要求。",
        en: "We are committed to providing a civilized, rational, friendly, and high-quality communication platform. You may use SoulCut to create and publish videos, images, text, and other content, and you must ensure that the published content (whether public or not) complies with applicable laws and regulations.",
      },
      {
        zh: "您不得制作、复制、发布、传播违法违规内容，包括但不限于：反对宪法确定的基本原则的；危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的；损害国家荣誉和利益的；宣扬恐怖主义、极端主义的；宣扬民族仇恨、民族歧视的；散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；侮辱或者诽谤他人，侵害他人名誉权、隐私权、肖像权、知识产权或其他合法权益的；法律、行政法规禁止的其他内容。",
        en: "You may not create, copy, publish, or distribute illegal content, including but not limited to: content that opposes the basic principles established by the Constitution; endangers national security, leaks state secrets, subverts state power, or undermines national unity; harms national honor and interests; promotes terrorism or extremism; promotes ethnic hatred or discrimination; spreads obscene, pornographic, gambling, violent, homicidal, or terroristic content, or content that abets crime; insults or defames others, or infringes on others' reputation, privacy, portrait rights, intellectual property, or other lawful rights; and other content prohibited by laws and administrative regulations.",
      },
      {
        zh: "如果我们有合理理由认为您的行为违反或可能违反上述约定的，我们有权进行处理，包括在不事先通知的情况下终止向您提供剪灵的全部或部分服务，并依法追究相关方的法律责任。",
        en: "If we have reasonable grounds to believe that your conduct violates or may violate the above, we have the right to take action, including terminating all or part of the SoulCut services provided to you without prior notice, and pursuing legal liability in accordance with the law.",
      },
    ],
  },
  {
    id: "security",
    title: {
      zh: "网络安全保护",
      en: "Network Security",
    },
    body: [
      {
        zh: "您不得使用任何插件、外挂、系统或第三方工具对剪灵的正常运行进行干扰、破坏、修改或施加其他影响，包括但不限于使用任何自动化程序、软件或类似工具接入剪灵，收集或处理其中信息、内容。",
        en: "You may not use any plug-in, add-on, system, or third-party tool to interfere with, damage, modify, or otherwise affect the normal operation of SoulCut, including but not limited to using any automated program, software, or similar tool to access SoulCut and collect or process its information or content.",
      },
      {
        zh: "您不得进行任何危害剪灵系统安全的行为，亦不得利用剪灵从事任何危害计算机网络安全的行为，包括但不限于：非法侵入网络、干扰网络正常功能、窃取网络数据；提供专门用于危害网络安全的程序、工具；使用未经许可的数据或进入未经许可的服务器或账号；对剪灵进行反向工程、反向汇编、编译或者以其他方式尝试发现剪灵的源代码。",
        en: "You may not engage in any conduct that harms the security of the SoulCut system, nor use SoulCut to engage in any conduct that harms computer network security, including but not limited to: illegally intruding into networks, interfering with normal network functions, or stealing network data; providing programs or tools specifically for harming network security; using unauthorized data or accessing unauthorized servers or accounts; and reverse engineering, decompiling, or otherwise attempting to discover SoulCut's source code.",
      },
      {
        zh: "如果我们有合理理由认为您的行为违反或可能违反上述约定的，或您有其他行为导致剪灵的信息和内容受到不利影响，或导致剪灵用户的权益受损的，我们有权进行处理，包括在不事先通知的情况下终止向您提供服务，并依法追究相关方的法律责任。",
        en: "If we have reasonable grounds to believe that your conduct violates or may violate the above, or that your conduct adversely affects SoulCut's information or content or harms the rights of SoulCut users, we have the right to take action, including terminating services to you without prior notice and pursuing legal liability in accordance with the law.",
      },
    ],
  },
  {
    id: "ai",
    title: {
      zh: "AI 功能使用规范",
      en: "AI Feature Usage",
    },
    body: [
      {
        zh: '为了向您提供更多创作选择和便利，剪灵为您提供多种以生成式或深度合成式人工智能技术为基础的产品功能与服务（合称"AI 功能"），例如文字生音频、文字生 3D 等。',
        en: 'To give you more creative options and convenience, SoulCut provides features and services based on generative or deep-synthesis AI technologies (collectively, "AI Features"), such as text-to-audio and text-to-3D.',
      },
      {
        zh: "您使用 AI 功能期间，可以向剪灵提交文本、图片、视频等输入内容，剪灵接收并响应您的输入内容而生成文本、图片、视频、音频、3D 场景等输出内容。您理解并承诺，输入内容均应为您享有知识产权或已获取权利人合法授权的内容，不存在任何违反适用的法律法规、侵犯他人合法权益的内容。",
        en: "When using AI Features, you may submit text, images, videos, and other inputs to SoulCut, and SoulCut generates text, images, videos, audio, 3D scenes, and other outputs in response. You understand and warrant that your inputs are owned by you or duly licensed, and do not violate applicable laws or infringe any third party's rights.",
      },
      {
        zh: "鉴于现阶段科学技术的局限性以及人工智能的性质，我们难以保证输出内容的真实性、准确性、可靠性。输出内容仅供作为一般信息和参考之用，不构成供您依赖的信息或建议。您应对输出内容自行加以判断并承担因使用输出内容而引起的所有风险及法律责任。",
        en: "Given the current limitations of technology and the nature of AI, we cannot guarantee the truthfulness, accuracy, or reliability of outputs. Outputs are for general information and reference only, and do not constitute information or advice you should rely on. You are responsible for evaluating outputs and bear all risks and legal responsibilities arising from their use.",
      },
      {
        zh: "您在生成、制作、发布或传播利用生成式人工智能等新技术生成、合成的非真实信息或其他可能导致公众混淆或误认的信息内容时，我们有权根据相关法律法规采取适当方式添加标识，不得以任何方式遮挡、涂抹、修改或删除我们对 AI 内容添加的标识。",
        en: "When you generate, produce, publish, or distribute AI-generated or synthesized content that may cause public confusion or misidentification, we have the right to add labels in accordance with applicable laws, and you may not obscure, smear, modify, or remove any labels we add to AI content.",
      },
    ],
  },
  {
    id: "privacy",
    title: {
      zh: "用户个人信息保护",
      en: "Personal Information Protection",
    },
    body: [
      {
        zh: "我们与您一同致力于个人信息的保护。保护用户个人信息是我们的基本原则之一。",
        en: "We are committed to protecting personal information together with you. Protecting user personal information is one of our fundamental principles.",
      },
      {
        zh: "当您开启或使用剪灵时，为实现您选择使用的功能、服务，或为遵守法律法规的要求，我们会处理相关信息。除实现剪灵基本功能、服务所需的信息，和根据法律法规要求所必需的信息之外，您可以拒绝我们处理其他信息，但这可能导致我们无法提供对应功能或服务。",
        en: "When you enable or use SoulCut, we process relevant information to provide the features and services you choose, or to comply with laws. Except for information needed to provide the basic features and services or required by law, you may refuse our processing of other information, though this may prevent us from providing the corresponding features or services.",
      },
      {
        zh: "我们将依法保护您浏览、修改、删除相关个人信息以及撤回授权的权利，并将运用加密技术、匿名化处理等其他与剪灵产品及服务相匹配的安全技术措施保护您的个人信息。更多关于个人信息保护的内容，请参见《剪灵隐私政策》。",
        en: "We protect your rights to view, modify, delete, and withdraw consent for personal information in accordance with the law, and we use encryption, anonymization, and other security measures matching SoulCut products and services. For more details, please see the SoulCut Privacy Policy.",
      },
    ],
  },
  {
    id: "ip",
    title: {
      zh: "知识产权",
      en: "Intellectual Property",
    },
    body: [
      {
        zh: "剪灵产品和服务的全部知识产权归我们所有，包括但不限于软件、技术、程序、网页、文字、图片、音频、视频、图表、版面设计、电子文档等。",
        en: "All intellectual property rights in SoulCut products and services belong to us, including but not limited to software, technology, programs, web pages, text, images, audio, video, charts, layouts, and electronic documents.",
      },
      {
        zh: "您理解并承诺，您在使用剪灵时发布或生成的内容，均由您原创或已获合法授权。您通过剪灵上传、发布所产生内容的知识产权归属您或原始著作权人所有。",
        en: "You understand and warrant that the content you publish or generate while using SoulCut is original or duly licensed. Intellectual property rights in content you upload or publish through SoulCut belong to you or the original copyright owner.",
      },
      {
        zh: '请您在任何情况下都不要擅自使用"剪灵"等与剪灵品牌相关的任何商标、服务标记、商号、域名、网站名称或其他品牌标识。未经我们事先书面同意，您不得将前述标识以任何方式展示、使用或申请注册商标、注册域名等。',
        en: 'Please do not use "SoulCut" or any trademarks, service marks, trade names, domain names, website names, or other brand identifiers related to the SoulCut brand without authorization. Without our prior written consent, you may not display, use, or apply to register such identifiers in any manner.',
      },
    ],
  },
  {
    id: "minor",
    title: {
      zh: "未成年人使用条款",
      en: "Minors",
    },
    body: [
      {
        zh: "若您是未满 18 周岁的未成年人，您应在监护人指导下认真阅读本协议，经您的监护人同意本协议后，方可使用剪灵。",
        en: "If you are under 18, you should read this Agreement carefully under the guidance of your guardian and may use SoulCut only after your guardian agrees to this Agreement.",
      },
      {
        zh: "我们重视对未成年人个人信息及隐私的保护。您应当取得权利人同意展示未成年人的肖像、声音等信息，且允许我们依据本协议使用、处理该等与未成年人相关的内容。",
        en: "We value the protection of minors' personal information and privacy. You should obtain the rights holder's consent to display a minor's portrait, voice, and other information, and permit us to use and process such content related to minors in accordance with this Agreement.",
      },
      {
        zh:
          "如您对保护未成年人权利有其他问题，您可通过 " +
          CONTACT_EMAIL +
          " 与我们联系。",
        en:
          "If you have other questions about protecting minors' rights, you may contact us at " +
          CONTACT_EMAIL +
          ".",
      },
    ],
  },
  {
    id: "disclaimer",
    title: {
      zh: "免责声明",
      en: "Disclaimer",
    },
    body: [
      {
        zh: "您理解并同意，我们提供的剪灵产品及服务是按照现有技术和条件所能达到的现状提供的。我们不对下述情形进行任何明示或暗示的保证：剪灵产品及服务完全适合您的使用要求；剪灵产品及服务不受干扰、及时、安全、可靠或不出现任何错误；剪灵产品及服务中任何错误都将能得到更正。",
        en: 'You understand and agree that SoulCut products and services are provided on an "as is" basis to the extent permitted by current technology and conditions. We make no express or implied warranties that: SoulCut will fully meet your requirements; SoulCut will be uninterrupted, timely, secure, reliable, or error-free; or any errors in SoulCut will be corrected.',
      },
      {
        zh: "我们会尽最大努力确保服务的连贯性和安全性，但剪灵产品及服务可能会受多种因素的影响或干扰。因不可抗力、电力故障、通讯网络故障、黑客攻击、恶意程序攻击、病毒、第三方服务瑕疵等我们不能控制的因素，或我们对相关系统或设备进行检修、维护、升级、保养，导致服务暂停、中止、终止或造成任何损失的，我们在法律法规允许范围内免于承担责任。",
        en: "We will make every effort to ensure service continuity and security, but SoulCut products and services may be affected by various factors. To the extent permitted by law, we are exempt from liability for service suspension, interruption, termination, or any losses caused by force majeure, power failures, network failures, hacker attacks, malicious programs, viruses, third-party service defects, or our maintenance, upgrades, or repairs.",
      },
      {
        zh: "除法律法规另有明确规定外，在任何情况下，我们均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害承担责任，该等损害包括但不限于您因使用剪灵而遭受的利润损失。",
        en: "Except as expressly required by law, we are not liable for any indirect, consequential, punitive, incidental, special, or exemplary damages, including but not limited to loss of profits arising from your use of SoulCut.",
      },
    ],
  },
  {
    id: "notice",
    title: {
      zh: "通知",
      en: "Notices",
    },
    body: [
      {
        zh: "为给您提供更好的服务，或因国家法律法规、政策调整，技术条件、产品功能等变化需要，我们会适时对本协议进行修订，修订内容构成本协议的组成部分。本协议更新后，我们会在剪灵客户端及官方网站发出更新版本。如您继续使用剪灵，即表示您已同意接受修订后的本协议内容。如您对修订后的协议内容存有异议的，请立即停止使用剪灵。",
        en: "To provide better service, or due to changes in laws, policies, technology, or product features, we may revise this Agreement from time to time, and the revisions form part of this Agreement. After an update, we will publish the revised version on the SoulCut client and official website. If you continue to use SoulCut, you are deemed to have agreed to the revised Agreement. If you disagree with the revisions, please stop using SoulCut immediately.",
      },
      {
        zh: "我们对您的通知可能会以包括但不限于系统提示、页面弹窗或提示、公告、站内信、电子邮件等方式中的一种或多种进行。",
        en: "Notices to you may be delivered through one or more means, including but not limited to system prompts, page pop-ups or prompts, announcements, in-app messages, and email.",
      },
    ],
  },
  {
    id: "misc",
    title: {
      zh: "其他",
      en: "Miscellaneous",
    },
    body: [
      {
        zh: "本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国法律。",
        en: "The formation, effectiveness, performance, interpretation, and dispute resolution of this Agreement are governed by the laws of the People's Republic of China.",
      },
      {
        zh: "本协议的签署地点为中华人民共和国北京市海淀区，若您与我们发生任何争议，双方应尽量友好协商解决，协商不成，您同意应将争议提交至北京市海淀区有管辖权的人民法院诉讼解决。",
        en: "This Agreement is deemed signed in Haidian District, Beijing, People's Republic of China. Any dispute between you and us shall first be resolved through friendly negotiation; if negotiation fails, you agree to submit the dispute to the competent court in Haidian District, Beijing.",
      },
      {
        zh: `如您对本协议有任何疑问，可通过 ${CONTACT_EMAIL} 与我们联系。官方网站：${OFFICIAL_SITE}。`,
        en: `If you have any questions about this Agreement, please contact us at ${CONTACT_EMAIL}. Official website: ${OFFICIAL_SITE}.`,
      },
    ],
  },
];
export default function UserAgreementPage() {
  const { locale } = useI18n();
  const isCn = locale === "cn";
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const scrollContainer = document.querySelector(".scrollable-content");
    if (!scrollContainer) return;
    const handleScroll = () => {
      setShowScrollTop(scrollContainer.scrollTop > 300);
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scrollable-content");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header - fixed, not scrollable */}
      <Header />
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollable-content">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Page title */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {isCn ? "用户服务协议" : "Terms of Service"}
          </h1>
          <p className="text-sm text-foreground/40 mb-10">
            {isCn
              ? "最近更新：2026 年 9 月 17 日"
              : "Last updated: September 17, 2026"}
          </p>
          {/* Agreement sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
                  {isCn ? section.title.zh : section.title.en}
                </h2>
                <div className="space-y-3">
                  {section.body.map((clause, i) => (
                    <p
                      key={i}
                      className="text-sm text-foreground/70 leading-relaxed"
                    >
                      {isCn ? clause.zh : clause.en}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-8 right-8 z-50
          w-12 h-12 rounded-full
          bg-black text-white
          border border-gray-300
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          hover:bg-gray-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
          active:bg-gray-900
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          cursor-pointer
          ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-16 pointer-events-none"
          }
        `}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
