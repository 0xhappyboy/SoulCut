"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useI18n } from "@/app/providers/I18nProvider";
// Bilingual clause helper: every clause carries a Chinese and English version.
type Clause = { zh: string; en: string };
// Section structure used across the privacy policy.
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
const OFFICIAL_SITE = "soulcut.app";
const sections: Section[] = [
  {
    id: "overview",
    title: {
      zh: "概要",
      en: "Overview",
    },
    body: [
      {
        zh: `剪灵是一款非线性视频剪辑软件，为每一帧注入灵魂。我们深知个人信息对您的重要性，将按照法律法规的规定，保护您的个人信息及隐私安全。本隐私政策旨在向您说明我们在不同场景下如何处理个人信息，请在使用剪灵前仔细阅读并理解。`,
        en: `SoulCut is a nonlinear video editing software that breathes soul into every frame. We understand the importance of personal information to you and will protect your personal information and privacy in accordance with applicable laws. This Privacy Policy explains how we handle personal information in different scenarios. Please read and understand it before using SoulCut.`,
      },
      {
        zh: "当您开启或使用剪灵时，为实现您选择使用的功能、服务，或为遵守法律法规的要求，我们会处理相关信息。除实现剪灵基本功能、服务所需的信息，和根据法律法规要求所必需的信息之外，您可以拒绝我们处理其他信息，但这可能导致我们无法提供对应功能、服务。",
        en: "When you enable or use SoulCut, we process relevant information to provide the features and services you choose, or to comply with laws. Except for information needed to provide the basic features and services or required by law, you may refuse our processing of other information, though this may prevent us from providing the corresponding features or services.",
      },
      {
        zh: "在特定场景下，我们还会通过即时告知（含弹窗、页面提示等）、功能更新说明等方式，向您说明对应的信息收集目的、范围及使用方式，这些即时告知及功能更新说明等构成本隐私政策的一部分，并与本隐私政策具有同等效力。",
        en: "In specific scenarios, we may also explain the purpose, scope, and use of information collection through just-in-time notices (such as pop-ups and page prompts) and feature update notes. These notices and notes form part of this Privacy Policy and have the same effect as this Privacy Policy.",
      },
    ],
  },
  {
    id: "collect",
    title: {
      zh: "我们如何收集和使用个人信息",
      en: "How We Collect and Use Personal Information",
    },
    body: [
      {
        zh: "【内容浏览和搜索】在您浏览剪灵端内的内容及各项信息的过程中，我们会记录您的浏览、使用情况。我们会通过设备对应的标识符信息来记录您的浏览、点击、导出、分享等操作行为信息。当您使用搜索时，我们会收集您的搜索关键字信息、操作日志记录。",
        en: "Content Browsing and Search. When you browse content and information within SoulCut, we record your browsing and usage. We record your browsing, clicking, exporting, sharing, and other operations through device identifiers. When you use search, we collect your search keywords and operation logs.",
      },
      {
        zh: "【视频创作工具能力】剪灵为您提供了丰富的视频与图片创作工具。您进行视频创作、拍摄、录制和/或剪辑时，我们会根据您具体使用到的功能类型分别向您请求授权相册、摄像头、麦克风权限，在您同意授予上述权限后，我们会相应打开相册、摄像头、麦克风或开启录屏，并读取相应的媒体影音数据（图片、视频、音频）。如您拒绝授权，您将无法使用前述功能，但不影响您使用剪灵的其他功能和服务。",
        en: "Video Creation Tools. SoulCut provides a rich set of video and image creation tools. When you create, shoot, record, and/or edit videos, we request photo library, camera, and microphone permissions based on the features you use. After you grant these permissions, we open the corresponding capabilities and read the relevant media data (images, videos, audio). If you decline, you cannot use those features, but other SoulCut features and services remain available.",
      },
      {
        zh: "【AI 特色剪辑功能】为向您提供文字生音频、文字生 3D 等 AI 特色功能，我们可能会将您主动选择或输入的内容（文字、图片、音视频等）回传至服务端处理，为您实现内容生成与特色剪辑。我们不会在未经您授权的情况下将前述信息用于其他任何目的，并会全程安全加密处理。",
        en: "AI Features. To provide AI features such as text-to-audio and text-to-3D, we may transmit the content you actively select or input (text, images, audio, video, etc.) to our servers for processing, so as to generate content and perform feature-specific editing. We will not use such information for any other purpose without your authorization, and it will be encrypted throughout processing.",
      },
      {
        zh: "【运营与安全保障】为了维护相关产品或服务的正常稳定运行，保护您或其他用户或公众的安全及合法利益，我们会收集必要的设备信息、日志信息、网络信息等，用于进行身份验证、识别违法违规情况、检测及防范安全事件。",
        en: "Operations and Security. To maintain the stable operation of our products and services and protect the safety and lawful interests of you, other users, and the public, we collect necessary device information, log information, and network information to perform identity verification, identify illegal activity, and detect and prevent security incidents.",
      },
      {
        zh: "【Cookie 等同类技术】当您使用剪灵及相关服务时，我们可能会使用相关技术向您的设备发送一个或多个 Cookie 或匿名标识符，以收集、标识您访问、使用本产品时的信息。我们承诺，不会将 Cookie 用于本隐私政策所述目的之外的任何其他用途。您可以在浏览器设置中清除 Cookie 数据。",
        en: "Cookies and Similar Technologies. When you use SoulCut and related services, we may use cookies or anonymous identifiers to collect and identify information about your access to and use of the product. We promise not to use cookies for any purpose other than those described in this Privacy Policy. You can clear cookie data in your browser settings.",
      },
      {
        zh: "【依法豁免征得同意处理个人信息】根据法律法规，在下列情形中，我们处理您的个人信息无需征得您的授权同意：根据您的要求订立或履行合同所必需；为履行法定职责或者法定义务所必需；为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理个人信息；在合理的范围内处理您自行公开的个人信息，或者其他已经合法公开的个人信息；法律法规规定的其他情形。",
        en: "Exemptions from Consent. Under applicable laws, we may process your personal information without your consent in the following circumstances: where necessary to enter into or perform a contract at your request; where necessary to perform statutory duties or legal obligations; where necessary to respond to public health emergencies or to protect the life, health, and property of natural persons in emergencies; where necessary for news reporting or public opinion supervision in the public interest, within a reasonable scope; where processing personal information you have made public yourself or that is otherwise lawfully public, within a reasonable scope; and other circumstances provided by laws and regulations.",
      },
    ],
  },
  {
    id: "sharing",
    title: {
      zh: "数据使用过程中涉及的合作方以及转移、公开个人信息",
      en: "Partners, Transfers, and Disclosure of Personal Information",
    },
    body: [
      {
        zh: "我们与合作方合作过程中，将遵守合法原则、正当与最小必要原则、安全审慎原则。我们会与合作方根据法律规定签署相关协议并约定各自的权利和义务，确保在使用相关个人信息的过程中遵守法律的相关规定、保护数据安全。",
        en: "When cooperating with partners, we follow the principles of legality, legitimacy and minimum necessity, and security and prudence. We sign relevant agreements with partners in accordance with the law, stipulating each party's rights and obligations, to ensure compliance with applicable laws and protection of data security when using personal information.",
      },
      {
        zh: "我们不会主动公开您未自行公开的信息，除非遵循国家法律法规规定或者获得您的同意。",
        en: "We will not proactively disclose information you have not made public yourself, unless required by laws and regulations or with your consent.",
      },
      {
        zh: "随着业务的持续发展，我们将有可能进行合并、收购、资产转让，您的个人信息有可能因此而被转移。在发生前述变更时，我们将按照法律法规及不低于本隐私政策所载明的安全标准要求继受方保护您的个人信息，继受方变更原先的处理目的、处理方式的，我们将要求继受方重新征得您的授权同意。",
        en: "As our business develops, we may undergo mergers, acquisitions, or asset transfers, and your personal information may be transferred as a result. In such events, we will require the successor to protect your personal information in accordance with laws and at a security standard no lower than that described in this Privacy Policy. If the successor changes the original purposes or methods of processing, we will require the successor to obtain your consent again.",
      },
      {
        zh: "如我们停止运营产品或服务，我们将及时停止继续收集您个人信息，并以逐一送达通知或公告的形式向您发送停止运营的告知，并对我们所持有的与已关停的产品或服务相关的个人信息进行删除或匿名化处理。",
        en: "If we cease operating a product or service, we will promptly stop collecting your personal information, notify you individually or by announcement, and delete or anonymize the personal information we hold related to the discontinued product or service.",
      },
    ],
  },
  {
    id: "manage",
    title: {
      zh: "管理您的个人信息",
      en: "Managing Your Personal Information",
    },
    body: [
      {
        zh: "我们非常重视您对个人信息的管理，并尽全力保护您对于您个人信息的查阅、复制、更正、补充、删除、撤回同意授权、投诉举报等权利。但请您理解，特定的业务功能和服务将需要您的信息才能得以完成，当您撤回同意或授权后，我们无法继续为您提供对应的功能和服务，也不再处理您相应的个人信息。但您撤回同意或授权的决定，不会影响我们此前基于您的授权而开展的个人信息处理活动。",
        en: "We value your management of personal information and make every effort to protect your rights to access, copy, correct, supplement, delete, withdraw consent, and file complaints. However, please understand that certain features and services require your information to function. After you withdraw consent or authorization, we cannot continue to provide the corresponding features and services, and will no longer process the relevant personal information. Your withdrawal does not affect our prior processing based on your authorization.",
      },
      {
        zh: "【系统权限设置】您可以在设备的操作系统设置功能中或剪灵客户端的设置页面中开启或关闭摄像头、麦克风、相册、日历、地理位置等权限，改变授权范围或撤回您的授权。撤回授权后我们将不再收集与这些权限相关的信息，但不会影响我们此前基于您的授权而开展的个人信息处理。",
        en: "System Permission Settings. You can enable or disable permissions for camera, microphone, photo library, calendar, and location in your device's operating system settings or in SoulCut's settings page, change the scope of authorization, or withdraw your authorization. After withdrawal, we will no longer collect information related to those permissions, but this does not affect our prior processing based on your authorization.",
      },
      {
        zh: "【查阅、更正、补充、删除】您可以在剪灵客户端的相应页面中查询您的基本资料以及其他信息，访问或删除您创作的作品信息。如您确有必要更正、补充或删除相关信息，可以通过本隐私政策公示的方式与我们联系。",
        en: "Access, Correction, Supplement, Deletion. You can view your basic information and other information on the relevant pages of the SoulCut client, and access or delete content you have created. If you need to correct, supplement, or delete relevant information, you may contact us through the means published in this Privacy Policy.",
      },
      {
        zh: "【复制、转移】如果您需要复制或下载我们收集存储的您的个人信息，您可以通过剪灵客户端提供的个人信息下载功能申请。如果您需要转移我们收集存储的您的个人信息，我们将根据法律法规的要求，为您提供转移路径。",
        en: "Copy and Portability. If you need to copy or download the personal information we collect and store, you can apply through the personal information download feature provided in the SoulCut client. If you need to transfer the personal information we collect and store, we will provide a transfer path in accordance with applicable laws.",
      },
    ],
  },
  {
    id: "security",
    title: {
      zh: "我们如何保护个人信息的安全",
      en: "How We Protect Personal Information",
    },
    body: [
      {
        zh: "我们非常重视您的个人信息安全，将努力采取合理的安全措施来保护您的个人信息，确保我们的个人信息处理活动符合法律、行政法规或依法可适用的其他制度的要求，并防止未经授权的访问以及个人信息泄露、篡改、丢失。",
        en: "We value the security of your personal information and will take reasonable security measures to protect it, ensure our processing complies with laws, administrative regulations, and other applicable rules, and prevent unauthorized access, leakage, tampering, and loss.",
      },
      {
        zh: "【安全技术措施】我们会使用不低于行业通常水平的加密、去标识化技术、匿名化处理及相关合理可行的手段保护您的个人信息，并使用安全保护机制防止您的个人信息遭到恶意攻击。",
        en: "Technical Measures. We use encryption, de-identification, anonymization, and other reasonably feasible means at a level no lower than industry norms to protect your personal information, and use security protection mechanisms to prevent malicious attacks.",
      },
      {
        zh: "【管理制度】我们会建立专门的安全部门、安全管理制度、数据安全流程保障您的个人信息安全。我们采取严格的数据使用和访问制度，确保只有授权人员才可访问您的个人信息。我们会定期对人员进行安全教育和培训，并适时对数据和技术进行安全审计。",
        en: "Management Measures. We establish dedicated security teams, security management systems, and data security processes to protect your personal information. We adopt strict data use and access rules so that only authorized personnel can access your personal information. We conduct regular security education and training for personnel and perform security audits of data and technology as appropriate.",
      },
      {
        zh: "【安全提示】尽管已经采取了上述合理有效措施，并已经遵守了相关法律法规要求的标准，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。您一旦离开剪灵，浏览或使用第三方提供的其他产品或服务，我们将没有能力和直接义务保护您向第三方提交的任何个人信息。",
        en: "Security Notice. Although we have taken the above reasonable and effective measures and complied with the standards required by applicable laws, please understand that due to technological limitations and various malicious means, even with the best efforts, the internet industry cannot always guarantee 100% security. Once you leave SoulCut and browse or use other products or services provided by third parties, we have neither the ability nor the direct obligation to protect any personal information you submit to third parties.",
      },
    ],
  },
  {
    id: "storage",
    title: {
      zh: "我们如何存储个人信息",
      en: "How We Store Personal Information",
    },
    body: [
      {
        zh: "【存储地点】我们依照法律法规的规定，将在境内运营过程中收集和产生的您的个人信息存储于中华人民共和国境内。我们不会将上述信息传输至境外，如果我们向境外传输，我们将会遵循相关国家规定或者征求您的同意。",
        en: "Storage Location. In accordance with laws and regulations, we store personal information collected and generated during domestic operations within the People's Republic of China. We will not transfer such information abroad. If we transfer it abroad, we will comply with relevant national regulations or seek your consent.",
      },
      {
        zh: "【存储期限】我们仅会在为您提供剪灵产品或服务所必需的期间内保留您的个人信息。当信息超出必要的保存期限后，我们将对您的个人信息进行删除或匿名化处理，但法律法规另有规定的除外。",
        en: "Storage Period. We retain your personal information only for the period necessary to provide SoulCut products or services. When the information exceeds the necessary retention period, we will delete or anonymize your personal information, unless otherwise required by laws and regulations.",
      },
    ],
  },
  {
    id: "minor",
    title: {
      zh: "我们如何保护未成年人",
      en: "How We Protect Minors",
    },
    body: [
      {
        zh: "若您是未成年人，在使用剪灵及相关服务前，应在您的父母或其他监护人监护、指导下共同阅读并同意本隐私政策。若您是未成年人的监护人，在使用剪灵及相关服务前，应为您的被监护人阅读并同意本隐私政策。",
        en: "If you are a minor, you should read and agree to this Privacy Policy together with your parents or other guardians before using SoulCut and related services. If you are the guardian of a minor, you should read and agree to this Privacy Policy on behalf of your ward before they use SoulCut and related services.",
      },
      {
        zh: "我们根据国家相关法律法规的规定保护未成年人的个人信息，只会在法律允许、父母或其他监护人明确同意或保护未成年人所必要的情况下收集、使用、共享或披露未成年人的个人信息。如果我们发现在未事先获得可证实的父母或其他监护人同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关信息。",
        en: "We protect minors' personal information in accordance with applicable laws, and collect, use, share, or disclose minors' personal information only where permitted by law, with the express consent of parents or other guardians, or as necessary to protect the minor. If we discover that we have collected a minor's personal information without prior verifiable consent from a parent or guardian, we will take steps to delete it as soon as possible.",
      },
    ],
  },
  {
    id: "revision",
    title: {
      zh: "隐私政策的查阅和修订",
      en: "Review and Revision of This Policy",
    },
    body: [
      {
        zh: "【查阅】您可以在剪灵客户端的隐私政策页面查看本隐私政策。",
        en: "Review. You can view this Privacy Policy on the privacy policy page of the SoulCut client.",
      },
      {
        zh: "【更新及通知】为了给您提供更好的服务，剪灵产品和服务将不时更新与变化，我们会适时对本隐私政策进行修订。未经您明确同意，我们不会削减您依据当前生效的隐私政策所应享受的权利。本隐私政策更新后，我们会在剪灵发出更新版本，并通过站内信或其他适当的方式提醒您更新的内容。",
        en: "Updates and Notices. To provide better services, SoulCut products and services will be updated and changed from time to time, and we will revise this Privacy Policy accordingly. Without your express consent, we will not reduce the rights you enjoy under the currently effective Privacy Policy. After an update, we will publish the revised version on SoulCut and remind you of the changes via in-app messages or other appropriate means.",
      },
    ],
  },
];
export default function PrivacyPlicy() {
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
            {isCn ? "隐私政策" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-foreground/40 mb-1">
            {isCn
              ? "更新日期：2026 年 9 月 17 日"
              : "Last updated: September 17, 2026"}
          </p>
          <p className="text-sm text-foreground/40 mb-10">
            {isCn
              ? "生效日期：2026 年 9 月 17 日"
              : "Effective date: September 17, 2026"}
          </p>
          {/* Policy sections */}
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
