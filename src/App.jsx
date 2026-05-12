import React, { useEffect, useMemo, useState } from "react";
import FileUpload from "./components/FileUpload";
import {
  Upload,
  Presentation,
  FileSpreadsheet,
  Archive,
  Pencil,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Target,
} from "lucide-react";


const API_BASE_URL = "https://reasearchplanning6backend-cshhdag7bcejc9c3.japaneast-01.azurewebsites.net";

function App() {
  const [documents, setDocuments] = useState([]);
  const [manualText, setManualText] = useState("");
  const [clientName, setClientName] = useState("");
  const [researchTitle, setResearchTitle] = useState("");

  const [outlineResult, setOutlineResult] = useState(null);

  const [tutorialPlanResult, setTutorialPlanResult] = useState(null);
  const [tutorialQ1Selected, setTutorialQ1Selected] = useState("");
  const [tutorialQ2Selected, setTutorialQ2Selected] = useState("");
  const [tutorialError, setTutorialError] = useState("");

  const [problemReframeResult, setProblemReframeResult] = useState(null);
  const [selectedAxisKey, setSelectedAxisKey] = useState("");
  const [selectedAxisText, setSelectedAxisText] = useState("");

  const [kickoffResult, setKickoffResult] = useState(null);
  const [subquestionsResult, setSubquestionsResult] = useState(null);
  const [analysisApproachResult, setAnalysisApproachResult] = useState(null);

  const [selectedAnalysisIds, setSelectedAnalysisIds] = useState([]);
  const [analysisSelectionResult, setAnalysisSelectionResult] = useState(null);
  const [analysisSelectionLoading, setAnalysisSelectionLoading] = useState(false);
  const [analysisSelectionError, setAnalysisSelectionError] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingOrien, setLoadingOrien] = useState(false);
  const [loadingTutorialPlan, setLoadingTutorialPlan] = useState(false);
  const [tutorialRefreshLoading, setTutorialRefreshLoading] = useState(false);
  const [loadingKickoff, setLoadingKickoff] = useState(false);
  const [loadingSubquestions, setLoadingSubquestions] = useState(false);  
  const [analysisApproachLoading, setAnalysisApproachLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [kickoffError, setKickoffError] = useState("");
  const [subquestionsError, setSubquestionsError] = useState("");
  const [analysisApproachError, setAnalysisApproachError] = useState("");
  const [targetConditionMemo, setTargetConditionMemo] = useState("");
  const [targetConditionResult, setTargetConditionResult] = useState("");
  const [targetConditionLoading, setTargetConditionLoading] = useState(false);
  const [targetConditionError, setTargetConditionError] = useState("");

  const [researchItemsResult, setResearchItemsResult] = useState(null);
  const [researchItemsLoading, setResearchItemsLoading] = useState(false);
  const [researchItemsError, setResearchItemsError] = useState("");

  const [analysisQuestionLimit, setAnalysisQuestionLimit] = useState("20");
  const [researchItemsShortlistLoading, setResearchItemsShortlistLoading] = useState(false);

  const [researchItemsConfirmLoading, setResearchItemsConfirmLoading] = useState(false);
  const [confirmedResearchItems, setConfirmedResearchItems] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg-1",
      role: "assistant",
      text: "こんにちは。右ペインのチャットで、企画書作成の次工程を案内します。",
    },
    {
      id: "msg-2",
      role: "assistant",
      text: "「まず何をするの？」「次は？」「どこを操作する？」のように入力すると、中央ペインの1〜7工程に沿って案内します。",
    },
  ]);

  const [pendingChatActionId, setPendingChatActionId] = useState(null);

  const [workspaceSaving, setWorkspaceSaving] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  const [previewTab, setPreviewTab] = useState("overview");
  const [selectedOverviewSlideId, setSelectedOverviewSlideId] = useState("cover");
  const [editingKey, setEditingKey] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [exported, setExported] = useState(false);
  const [isCheckSummaryVisible, setIsCheckSummaryVisible] = useState(true);

  const [pptTemplateFile, setPptTemplateFile] = useState(null);
  const [pptExportLoading, setPptExportLoading] = useState(false);
  const [pptExportError, setPptExportError] = useState("");

  const [proposalReviewResult, setProposalReviewResult] = useState(null);
  const [proposalReviewLoading, setProposalReviewLoading] = useState(false);
  const [proposalReviewError, setProposalReviewError] = useState("");

  const extractedTexts = useMemo(() => {
    return documents
      .map((doc) => doc.text || "")
      .filter((text) => text.trim() !== "");
  }, [documents]);

  const formatTodayForPpt = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}年${month}月${day}日`;
  };

  const toText = (value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.filter(Boolean).join("\n");
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const normalizeListText = (value) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.filter(Boolean).join("\n");
    return String(value);
  };

  const orienOutlineText = outlineResult?.orien_outline_text?.trim() || "";
  const mainQuestion = kickoffResult?.問い?.trim() || "";

  const analysisBlocksForView =
    analysisSelectionResult?.analysis_blocks ||
    analysisApproachResult?.analysis_blocks ||
    [];

  const kickoffText = kickoffResult
    ? [
        `目標: ${kickoffResult?.目標 || ""}`,
        `現状: ${kickoffResult?.現状 || ""}`,
        `ビジネス課題: ${kickoffResult?.ビジネス課題 || ""}`,
        `調査目的: ${kickoffResult?.調査目的 || ""}`,
        `問い: ${kickoffResult?.問い || ""}`,
        `仮説: ${kickoffResult?.仮説 || ""}`,
        `ポイント: ${kickoffResult?.ポイント || ""}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const subquestionsText = subquestionsResult?.subq_list?.length
    ? subquestionsResult.subq_list
        .map((sq, index) =>
          [
            `SQ${index + 1}: ${sq.subq || ""}`,
            `axis: ${
              Array.isArray(sq.axis) ? sq.axis.join(", ") : sq.axis || ""
            }`,
            `items: ${
              Array.isArray(sq.items) ? sq.items.join(", ") : sq.items || ""
            }`,
          ].join("\n")
        )
        .join("\n\n")
    : "";

  const bunsekiText = analysisBlocksForView.length
    ? analysisBlocksForView
        .map((block, index) =>
          [
            `分析${index + 1}: ${block.subq || ""}`,
            `approach: ${block.approach || ""}`,
            `hypothesis: ${block.hypothesis || ""}`,
            `axis: ${
              Array.isArray(block.axis) ? block.axis.join(", ") : block.axis || ""
            }`,
            `items: ${
              Array.isArray(block.items) ? block.items.join(", ") : block.items || ""
            }`,
          ].join("\n")
        )
        .join("\n\n")
    : "";  

  const targetConditionText = targetConditionResult?.trim() || "";

  const selectedAnalysisBlocksForResearchItems = analysisBlocksForView.filter((block) =>
    selectedAnalysisIds.includes(block.id)
  );

  const confirmedScreeningItems =
    confirmedResearchItems?.confirmed_screening_items ||
    researchItemsResult?.screening_items ||
    [];

  const confirmedAnalysisItems =
    confirmedResearchItems?.confirmed_analysis_items ||
    (researchItemsResult?.analysis_items || []).filter(
      (item) => item.adoption_status === "adopted"
    );

  const screeningMatrixRows = useMemo(() => {
    return (confirmedScreeningItems || []).map((item, index) => ({
      category: "スクリーニング調査",
      number: item.number || index + 1,
      question: item.question || item.text || "",
      questionType: item.question_type || "",
      choicesExample: Array.isArray(item.choices_example)
        ? item.choices_example.join(" / ")
        : item.choices_example || "",
    }));
  }, [confirmedScreeningItems]);

  const mainMatrixRows = useMemo(() => {
    return (confirmedAnalysisItems || []).map((item, index) => ({
      subq: item.subq || "",
      number: item.number || index + 1,
      question: item.question || item.text || "",
      questionType: item.question_type || "",
      choicesExample: Array.isArray(item.choices_example)
        ? item.choices_example.join(" / ")
        : item.choices_example || "",
      reason: item.reason || "",
    }));
  }, [confirmedAnalysisItems]);    

  const tutorialSummary = tutorialPlanResult?.tutorial_summary || null;
  const tutorialQ1 = tutorialPlanResult?.q1 || null;
  const tutorialQ2 = tutorialPlanResult?.q2 || null;
  const tutorialQ3 = tutorialPlanResult?.q3 || [];
  const tutorialSlidePlan = tutorialPlanResult?.slide_plan || null;

  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  const [editingSqId, setEditingSqId] = useState("");
  const [editingSqValue, setEditingSqValue] = useState("");

  const resetKickoffAndSubquestions = () => {
    setKickoffResult(null);
    setSubquestionsResult(null);
    setAnalysisApproachResult(null);
    setKickoffError("");
    setSubquestionsError("");
    setAnalysisApproachError("");
    setSelectedAnalysisIds([]);
    setSelectedAnalysisId("");
    setAnalysisSelectionResult(null);
    setAnalysisSelectionError("");
    setResearchItemsResult(null);
    setConfirmedResearchItems(null);
    setResearchItemsError("");
    setPreviewTab("overview");
    setSelectedOverviewSlideId("cover");
  };

  const resetTutorialAndDownstream = () => {
    setTutorialPlanResult(null);
    setTutorialQ1Selected("");
    setTutorialQ2Selected("");
    setTutorialError("");
    setProblemReframeResult(null);
    setSelectedAxisKey("");
    setSelectedAxisText("");
    resetKickoffAndSubquestions();
  };

  const buildPptPayload = () => {
    const items = [];

    const addItem = (slideIndex, shapeName, text, sourceKey) => {
      const value = toText(text).trim();
      if (!value) return;

      items.push({
        slide_index: slideIndex,
        slide_no: slideIndex + 1,
        shape_name: shapeName,
        text: value,
        source: {
          type: "react_state",
          key: sourceKey,
        },
      });
    };

    // =========================
    // Slide 1: 表紙
    // =========================
    addItem(0, "Edit_client", clientName, "clientName");
    addItem(0, "Edit_title", researchTitle || "調査企画書", "researchTitle");
    addItem(0, "Edit_date", formatTodayForPpt(), "today");

    // =========================
    // Slide 2: KON
    // =========================
    addItem(1, "EDIT_TO_BE", kickoffResult?.目標, "kickoffResult.目標");
    addItem(1, "EDIT_AS_IS", kickoffResult?.現状, "kickoffResult.現状");
    addItem(1, "EDIT_PROBLEM", kickoffResult?.ビジネス課題, "kickoffResult.ビジネス課題");
    addItem(1, "EDIT_PURPOSE", kickoffResult?.調査目的, "kickoffResult.調査目的");
    addItem(1, "EDIT_QUESTION", kickoffResult?.問い, "kickoffResult.問い");
    addItem(1, "EDIT_HYPOTHESIS", kickoffResult?.仮説, "kickoffResult.仮説");

    // =========================
    // Slide 3: 問いの分解
    // =========================
    const subqList = subquestionsResult?.subq_list || subquestionsResult?.items || [];
    const subqTreeText = subqList.length
      ? subqList
          .map((sq, index) => {
            const subq = sq.subq || sq.question || "";
            const axis = normalizeListText(sq.axis);
            const itemsText = normalizeListText(sq.items);

            return [
              `SQ${index + 1}: ${subq}`,
              axis ? `分析軸: ${axis}` : "",
              itemsText ? `評価項目: ${itemsText}` : "",
            ]
              .filter(Boolean)
              .join("\n");
          })
          .join("\n\n")
      : toText(subquestionsResult);

    addItem(2, "EDIT1_subQ", subqTreeText, "subquestionsResult");

    // =========================
    // Slide 4〜12: 分析アプローチ
    // =========================
    const analysisBlocksSource =
      analysisSelectionResult?.analysis_blocks ||
      analysisSelectionResult?.selected_blocks ||
      analysisApproachResult?.analysis_blocks ||
      analysisApproachResult?.items ||
      [];

    const selectedBlocks =
      selectedAnalysisIds && selectedAnalysisIds.length > 0
        ? analysisBlocksSource.filter((block) => selectedAnalysisIds.includes(block.id))
        : analysisBlocksSource;

    selectedBlocks.slice(0, 9).forEach((block, index) => {
      const i = index + 1;
      const slideIndex = 3 + index;

      addItem(slideIndex, `EDIT1_subQ${i}_1`, block.subq || block.question, `analysisBlocks.${i}.subq`);
      addItem(slideIndex, `EDIT1_subQ${i}_2`, normalizeListText(block.axis), `analysisBlocks.${i}.axis`);
      addItem(slideIndex, `EDIT1_subQ${i}_3`, normalizeListText(block.items), `analysisBlocks.${i}.items`);
      addItem(slideIndex, `EDIT1_subQ${i}_4`, block.approach, `analysisBlocks.${i}.approach`);
      addItem(slideIndex, `EDIT1_subQ${i}_5`, block.hypothesis, `analysisBlocks.${i}.hypothesis`);
    });

    // =========================
    // Slide 13: 対象者条件
    // =========================
    addItem(12, "EDIT1_taisyosya", targetConditionResult, "targetConditionResult");

    // =========================
    // Slide 14: 調査項目案
    // ※本体はExcel出力前提。PPTには要約を入れる。
    // =========================
    const confirmedAnalysisItems =
      confirmedResearchItems?.confirmed_analysis_items ||
      confirmedResearchItems?.analysis_items ||
      researchItemsResult?.analysis_items ||
      [];

    const researchItemsSummary = confirmedAnalysisItems.length
      ? [
          "調査項目案は別添Excelを参照。",
          "",
          "主な本調査用項目：",
          ...confirmedAnalysisItems
            .slice(0, 12)
            .map((item, index) => `・${index + 1}. ${item.question || ""}`),
        ].join("\n")
      : "調査項目案は別添Excelを参照。";

    addItem(13, "EDIT1_Qimg", researchItemsSummary, "researchItemsResult");

    return {
      meta: {
        generated_at: new Date().toISOString(),
        client_name: clientName,
        research_title: researchTitle,
        items_count: items.length,
      },
      items,
    };
  };


  const handleUploadComplete = (uploadedDocuments) => {
    setDocuments(uploadedDocuments || []);
    setErrorMessage("");
    setSuccessMessage(
      uploadedDocuments?.length
        ? `${uploadedDocuments.length}件のドキュメントを読み込みました。`
        : ""
    );
    setLoadingUpload(false);
    setOutlineResult(null);
    resetTutorialAndDownstream();
  };

  const handleUploadStart = () => {
    setLoadingUpload(true);
    setErrorMessage("");
    setSuccessMessage("");
    setOutlineResult(null);
    resetTutorialAndDownstream();
  };

  const handleUploadError = (message) => {
    setLoadingUpload(false);
    setErrorMessage(message || "エラー: アップロードに失敗しました。");
    setSuccessMessage("");
  };

  const handleGenerateTutorialPlan = async (outlineText) => {
    try {
      setTutorialError("");
      setLoadingTutorialPlan(true);
      setTutorialPlanResult(null);

      const response = await fetch(`${API_BASE_URL}/api/tutorial/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: outlineText,
          manual_text: manualText,
          extracted_texts: extractedTexts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "チュートリアル初期化に失敗しました。");
      }

      setTutorialPlanResult(data);
      setTutorialQ1Selected(
        data?.q1?.selected_key || data?.q1?.recommended_key || ""
      );
      setTutorialQ2Selected(
        data?.q2?.selected_key || data?.q2?.recommended_key || ""
      );
    } catch (error) {
      console.error(error);
      setTutorialError(
        `エラー: ${error.message || "チュートリアル初期化に失敗しました。"}`
      );
    } finally {
      setLoadingTutorialPlan(false);
    }
  };

  const handleGenerateOutline = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setLoadingOrien(true);
      setOutlineResult(null);
      resetTutorialAndDownstream();

      const response = await fetch(`${API_BASE_URL}/orien/outline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extracted_texts: extractedTexts,
          manual_text: manualText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "API呼び出しに失敗しました。");
      }

      setOutlineResult(data);
      await handleGenerateTutorialPlan(data.orien_outline_text || "");
      setSuccessMessage("オリエン整理とチュートリアル初期化が完了しました。");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        `エラー: ${error.message || "オリエン整理の実行に失敗しました。"}`
      );
    } finally {
      setLoadingOrien(false);
    }
  };

  const handleRefreshTutorial = async (nextQ1, nextQ2) => {
    try {
      setTutorialError("");
      setTutorialRefreshLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/tutorial/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          q1_selected_key: nextQ1,
          q2_selected_key: nextQ2,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "チュートリアル再計算に失敗しました。");
      }

      setTutorialPlanResult((prev) => ({
        ...(prev || {}),
        q3: data.q3,
        slide_plan: data.slide_plan,
        q1: prev?.q1 ? { ...prev.q1, selected_key: nextQ1 } : prev?.q1,
        q2: prev?.q2 ? { ...prev.q2, selected_key: nextQ2 } : prev?.q2,
      }));
      resetKickoffAndSubquestions();
    } catch (error) {
      console.error(error);
      setTutorialError(
        `エラー: ${error.message || "チュートリアル再計算に失敗しました。"}`
      );
    } finally {
      setTutorialRefreshLoading(false);
    }
  };

  const handleTutorialQ1Change = async (nextKey) => {
    setTutorialQ1Selected(nextKey);
    await handleRefreshTutorial(nextKey, tutorialQ2Selected);
  };

  const handleTutorialQ2Change = async (nextKey) => {
    setTutorialQ2Selected(nextKey);
    await handleRefreshTutorial(tutorialQ1Selected, nextKey);
  };

  useEffect(() => {
    const generatedAxisText = buildSelectedAxisTextFromTutorial({
      q1Key: tutorialQ1Selected || tutorialQ1?.recommended_key || "",
      q2Key: tutorialQ2Selected || tutorialQ2?.recommended_key || "",
      q3: tutorialQ3,
      summary: tutorialSummary,
    });

    setSelectedAxisKey("tutorial_axis");
    setSelectedAxisText(generatedAxisText);
  }, [tutorialQ1Selected, tutorialQ2Selected, tutorialQ3, tutorialSummary, tutorialQ1]);

  const handleGenerateKickoff = async () => {
    try {
      setKickoffError("");
      setSubquestionsError("");
      setAnalysisApproachError("");
      setAnalysisSelectionError("");
      setSuccessMessage("");
      setLoadingKickoff(true);
      setKickoffResult(null);
      setSubquestionsResult(null);
      setAnalysisApproachResult(null);
      setAnalysisSelectionResult(null);
      setSelectedAnalysisIds([]);
      setSelectedAnalysisId("");

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!selectedAxisText.trim()) {
        throw new Error("先にチュートリアルを完了してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/kickoff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          selected_axis_text: selectedAxisText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "KON生成に失敗しました。");
      }

      setKickoffResult(data);
      setSuccessMessage("KONの生成が完了しました。");
    } catch (error) {
      console.error(error);
      setKickoffError(
        `エラー: ${error.message || "KON生成の実行に失敗しました。"}`
      );
    } finally {
      setLoadingKickoff(false);
    }
  };

  const handleGenerateSubquestions = async () => {
    try {
      setSubquestionsError("");
      setAnalysisApproachError("");
      setAnalysisSelectionError("");
      setSuccessMessage("");
      setLoadingSubquestions(true);
      setSubquestionsResult(null);
      setAnalysisApproachResult(null);
      setAnalysisSelectionResult(null);
      setSelectedAnalysisIds([]);
      setSelectedAnalysisId("");

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!selectedAxisText.trim()) {
        throw new Error("先にチュートリアルを完了してください。");
      }

      const currentMainQuestion = (localSectionDrafts["KON_問い"] || "").trim(); 

      if (!currentMainQuestion) {
        throw new Error("先にKONを生成して『問い』を作成してください。");
      }

      console.log("SQ生成に送る問い:", currentMainQuestion);

      const response = await fetch(`${API_BASE_URL}/api/subquestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          selected_axis_text: selectedAxisText,
          main_question: currentMainQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "SQ生成に失敗しました。");
      }

      setSubquestionsResult(data);
      setSuccessMessage("SQの生成が完了しました。");
    } catch (error) {
      console.error(error);
      setSubquestionsError(
        `エラー: ${error.message || "SQ生成の実行に失敗しました。"}`
      );
    } finally {
      setLoadingSubquestions(false);
    }
  };

  const handleGenerateAnalysisApproach = async () => {
    try {
      setAnalysisApproachError("");
      setAnalysisSelectionError("");
      setSuccessMessage("");
      setAnalysisApproachLoading(true);
      setAnalysisApproachResult(null);
      setAnalysisSelectionResult(null);
      setSelectedAnalysisIds([]);
      setSelectedAnalysisId("");

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!selectedAxisText.trim()) {
        throw new Error("先にチュートリアルを完了してください。");
      }

      if (!kickoffResult) {
        throw new Error("先にKONを生成してください。");
      }

      if (!subquestionsResult?.subq_list?.length) {
        throw new Error("先にSQを生成してください。");
      }

      // ⭐ ここが重要：subq_listを正規化（string→配列対応）
      const normalizedSubqList = subquestionsResult.subq_list.map((sq, idx) => ({
        id: sq.id || `sq-${String(idx + 1).padStart(2, "0")}`,
        subq: sq.subq || "",
        axis: Array.isArray(sq.axis)
          ? sq.axis
          : sq.axis
          ? [sq.axis]
          : [],
        items: Array.isArray(sq.items)
          ? sq.items
          : sq.items
          ? [sq.items]
          : [],
      }));

      const requestBody = {
        orien_outline_text: orienOutlineText,
        selected_axis_text: selectedAxisText,
        kickoff: kickoffResult,
        subq_list: normalizedSubqList,
      };

      console.log("analysis request body", requestBody);

      const response = await fetch(`${API_BASE_URL}/api/analysis-approach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      // ⭐ エラー表示を人間が読める形に変換
      if (!response.ok) {
        let message = "分析アプローチ生成に失敗しました。";

        if (Array.isArray(data.detail)) {
          message = data.detail
            .map((d) => {
              const loc = Array.isArray(d.loc) ? d.loc.join(" > ") : "";
              const msg = d.msg || JSON.stringify(d);
              return `${loc}: ${msg}`;
            })
            .join("\n");
        } else if (typeof data.detail === "string") {
          message = data.detail;
        }

        throw new Error(message);
      }

      const blocks = data.analysis_blocks || [];

      setAnalysisApproachResult(data);

      const initialSelectedIds = blocks
        .filter((block) => block.selected)
        .map((block) => block.id);

      setSelectedAnalysisIds(initialSelectedIds);
      setSelectedAnalysisId(
        initialSelectedIds[0] || blocks[0]?.id || ""
      );

      setAnalysisSelectionResult(data.selection_summary || null);
      setAnalysisSelectionError("");

      setPreviewTab("analysis");
      setSuccessMessage("分析アプローチの生成が完了しました。");

    } catch (error) {
      console.error(error);

      setAnalysisApproachError(
        `エラー: ${
          error.message || "分析アプローチ生成の実行に失敗しました。"
        }`
      );
    } finally {
      setAnalysisApproachLoading(false);
    }
  };

  const handleGenerateTargetCondition = async () => {
    try {
      setTargetConditionError("");
      setSuccessMessage("");
      setTargetConditionLoading(true);
      setTargetConditionResult("");

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!kickoffResult) {
        throw new Error("先にKONを生成してください。");
      }

      if (!subquestionsResult?.subq_list?.length) {
        throw new Error("先にSQを生成してください。");
      }

      if (!analysisBlocksForView.length) {
        throw new Error("先に分析アプローチを生成してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/target-condition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          kickoff_text: kickoffText,
          subquestions: subquestionsText,
          bunseki: bunsekiText,
          memo: targetConditionMemo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "調査対象者条件の生成に失敗しました。");
      }

      setTargetConditionResult(data.target_condition_text || "");
      setSuccessMessage("調査対象者条件を生成しました。");
    } catch (error) {
      console.error(error);
      setTargetConditionError(
        `エラー: ${
          error.message || "調査対象者条件の生成に失敗しました。"
        }`
      );
    } finally {
      setTargetConditionLoading(false);
    }
  };

  const handleGenerateResearchItems = async () => {
    try {
      setResearchItemsError("");
      setSuccessMessage("");
      setResearchItemsLoading(true);
      setResearchItemsResult(null);
      setConfirmedResearchItems(null);

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!targetConditionText) {
        throw new Error("先に調査対象者条件を生成してください。");
      }

      if (!analysisBlocksForView.length) {
        throw new Error("先に分析アプローチを生成してください。");
      }

      if (!selectedAnalysisIds.length) {
        throw new Error("先に採用する分析アプローチを選択してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/research-items/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          kickoff_text: kickoffText,
          subquestions_text: subquestionsText,
          target_condition_text: targetConditionText,
          analysis_blocks: analysisBlocksForView.map((block) => ({
            id: block.id,
            subq: block.subq || "",
            approach: block.approach || "",
            hypothesis: block.hypothesis || "",
            axis: Array.isArray(block.axis)
              ? block.axis
              : block.axis
              ? [block.axis]
              : [],
            items: Array.isArray(block.items)
              ? block.items
              : block.items
              ? [block.items]
              : [],
            priority: block.priority || null,
            selected: selectedAnalysisIds.includes(block.id),
          })),
          selected_analysis_ids: selectedAnalysisIds,
          min_analysis_questions: 40,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "調査項目生成に失敗しました。");
      }

      setResearchItemsResult(data);
      setSuccessMessage("調査項目を生成しました。");
      setPreviewTab("overview");
      setSelectedOverviewSlideId("question-items");
    } catch (error) {
      console.error(error);
      setResearchItemsError(
        `エラー: ${error.message || "調査項目生成に失敗しました。"}`
      );
    } finally {
      setResearchItemsLoading(false);
    }
  };

  const handleGenerateProposalReview = async () => {
    try {
      setProposalReviewError("");
      setSuccessMessage("");
      setProposalReviewLoading(true);
      setProposalReviewResult(null);

      if (!orienOutlineText) {
        throw new Error("先にオリエン整理を実行してください。");
      }

      if (!kickoffResult) {
        throw new Error("先にKONを生成してください。");
      }

      if (!subquestionsResult?.subq_list?.length) {
        throw new Error("先にSQを生成してください。");
      }

      if (!analysisBlocksForView.length) {
        throw new Error("先に分析アプローチを生成してください。");
      }

      if (!targetConditionText) {
        throw new Error("先に調査対象者条件を生成してください。");
      }

      if (!researchItemsResult) {
        throw new Error("先に調査項目を生成してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/proposal-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orien_outline_text: orienOutlineText,
          selected_axis_text: selectedAxisText,
          kickoff_text: kickoffText,
          subquestions_text: subquestionsText,
          analysis_text: bunsekiText,
          target_condition_text: targetConditionText,
          research_items_text: JSON.stringify(researchItemsResult, null, 2),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "企画書レビューに失敗しました。");
      }

      setProposalReviewResult(data);
      setSuccessMessage("企画書レビューが完了しました。");
    } catch (error) {
      console.error(error);
      setProposalReviewError(
        `エラー: ${error.message || "企画書レビューの実行に失敗しました。"}`
      );
    } finally {
      setProposalReviewLoading(false);
    }
  };

  const handleShortlistResearchItems = async () => {
    try {
      setResearchItemsError("");
      setSuccessMessage("");
      setResearchItemsShortlistLoading(true);

      const analysisItems = researchItemsResult?.analysis_items || [];
      const desiredCount = Number(analysisQuestionLimit);

      if (!analysisItems.length) {
        throw new Error("先に調査項目を生成してください。");
      }

      if (!desiredCount || desiredCount <= 0) {
        throw new Error("絞り込み設問数を正しく入力してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/research-items/shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_items: analysisItems,
          desired_count: desiredCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "調査項目の絞り込みに失敗しました。");
      }

      setResearchItemsResult((prev) => ({
        ...(prev || {}),
        analysis_items: data.analysis_items || [],
        shortlist_summary: data.summary || null,
      }));

      setSuccessMessage(
        `分析用設問を${data?.summary?.after_count || desiredCount}問に絞り込みました。`
      );
    } catch (error) {
      console.error(error);
      setResearchItemsError(
        `エラー: ${error.message || "調査項目の絞り込みに失敗しました。"}`
      );
    } finally {
      setResearchItemsShortlistLoading(false);
    }
  };

  const handleToggleResearchItemAdoption = (itemId) => {
    setResearchItemsResult((prev) => {
      if (!prev?.analysis_items?.length) return prev;

      return {
        ...prev,
        analysis_items: prev.analysis_items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                adoption_status:
                  item.adoption_status === "adopted" ? "rejected" : "adopted",
              }
            : item
        ),
      };
    });
  };

  const handleConfirmResearchItems = async () => {
    try {
      setResearchItemsError("");
      setSuccessMessage("");
      setResearchItemsConfirmLoading(true);

      const screeningItems = researchItemsResult?.screening_items || [];
      const analysisItems = researchItemsResult?.analysis_items || [];

      if (!screeningItems.length && !analysisItems.length) {
        throw new Error("先に調査項目を生成してください。");
      }

      const response = await fetch(`${API_BASE_URL}/api/research-items/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screening_items: screeningItems,
          analysis_items: analysisItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "調査項目の確定に失敗しました。");
      }

      setConfirmedResearchItems(data);
      setSuccessMessage(
        `採用項目を確定しました（分析用 ${data?.summary?.after_count || 0}問）。`
      );
      setPreviewTab("overview");
      setSelectedOverviewSlideId("question-items");
    } catch (error) {
      console.error(error);
      setResearchItemsError(
        `エラー: ${error.message || "調査項目の確定に失敗しました。"}`
      );
    } finally {
      setResearchItemsConfirmLoading(false);
    }
  };


  const recommendedAnalysisBlocks = analysisBlocksForView.filter(
    (block) => block.priority === "recommended"
  );

  const candidateAnalysisBlocks = analysisBlocksForView.filter(
    (block) => block.priority === "candidate"
  );

  const excludedAnalysisBlocks = analysisBlocksForView.filter(
    (block) => block.priority === "excluded"
  );

  const maxSelectableAnalysis =
    analysisSelectionResult?.selection_summary?.max_selectable ||
    analysisApproachResult?.selection_summary?.max_selectable ||
    5;

  const selectedAnalysisBlock =
    analysisBlocksForView.find((block) => block.id === selectedAnalysisId) ||
    analysisBlocksForView[0] ||
    null;

  const handleToggleAnalysisSelection = (analysisId) => {
    setAnalysisSelectionError("");

    setSelectedAnalysisIds((prev) => {
      if (prev.includes(analysisId)) {
        return prev.filter((id) => id !== analysisId);
      }

      if (prev.length >= maxSelectableAnalysis) {
        setAnalysisSelectionError(
          `分析アプローチは最大${maxSelectableAnalysis}件まで選択できます。`
        );
        return prev;
      }

      return [...prev, analysisId];
    });
  };

  const handleSelectAnalysisPreview = (analysisId) => {
    setSelectedAnalysisId(analysisId);
    setPreviewTab("analysis");
  };

  const handleApplyAnalysisSelection = async () => {
    try {
      setAnalysisSelectionLoading(true);
      setAnalysisSelectionError("");

      const sourceBlocks =
        analysisSelectionResult?.analysis_blocks ||
        analysisApproachResult?.analysis_blocks ||
        [];

      const response = await fetch(`${API_BASE_URL}/api/analysis-approach/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_blocks: sourceBlocks,
          selected_analysis_ids: selectedAnalysisIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "分析アプローチ選択の反映に失敗しました。");
      }

      setAnalysisSelectionResult(data);

      const normalizedSelectedIds = (data.analysis_blocks || [])
        .filter((block) => block.selected)
        .map((block) => block.id);

      setSelectedAnalysisIds(normalizedSelectedIds);

      if (data.slide_plan) {
        setTutorialPlanResult((prev) => ({
          ...(prev || {}),
          slide_plan: data.slide_plan,
        }));
      }

      setSuccessMessage("分析アプローチの選択を反映しました。");
    } catch (error) {
      setAnalysisSelectionError(
        `エラー: ${error.message || "分析アプローチ選択の反映に失敗しました。"}`
      );
    } finally {
      setAnalysisSelectionLoading(false);
    }
  };

  const handleResetAnalysisSelection = () => {
    const sourceBlocks = analysisApproachResult?.analysis_blocks || [];
    const initialSelectedIds = sourceBlocks
      .filter((block) => block.selected)
      .map((block) => block.id);

    setSelectedAnalysisIds(initialSelectedIds);
    setAnalysisSelectionResult(null);
    setAnalysisSelectionError("");

    if (initialSelectedIds.length) {
      setSelectedAnalysisId(initialSelectedIds[0]);
    } else if (sourceBlocks.length) {
      setSelectedAnalysisId(sourceBlocks[0].id);
    } else {
      setSelectedAnalysisId("");
    }

    setSuccessMessage("分析アプローチ選択を初期状態に戻しました。");
  };

  const handleSaveWorkspace = async () => {
    try {
      setWorkspaceSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${API_BASE_URL}/api/workspace/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extracted_texts: extractedTexts,
          manual_text: manualText,
          orien_outline_text: outlineResult?.orien_outline_text || "",
          problem_reframe: {
            tutorial_plan_result: tutorialPlanResult,
            tutorial_q1_selected: tutorialQ1Selected,
            tutorial_q2_selected: tutorialQ2Selected,
          },
          kickoff: kickoffResult,
          subq_list: subquestionsResult?.subq_list || [],
          analysis_blocks: analysisApproachResult?.analysis_blocks || [],
          selected_axis_key: selectedAxisKey,
          selected_axis_text: selectedAxisText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "保存に失敗しました");
      }

      setSuccessMessage("ワークスペースを保存しました。");
    } catch (error) {
      setErrorMessage(`エラー: ${error.message}`);
    } finally {
      setWorkspaceSaving(false);
    }
  };

  const handleLoadWorkspace = async () => {
    try {
      setWorkspaceLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${API_BASE_URL}/api/workspace/load`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("読み込みに失敗しました");
      }

      const restoredDocs = (data.extracted_texts || []).map((text, index) => ({
        file_name: `loaded_${index + 1}.txt`,
        text,
      }));

      setDocuments(restoredDocs);
      setManualText(data.manual_text || "");

      setOutlineResult(
        data.orien_outline_text
          ? {
              orien_outline_text: data.orien_outline_text,
              orien_outline_ai_draft: "",
            }
          : null
      );

      const loadedTutorialResult =
        data.problem_reframe?.tutorial_plan_result || null;
      const loadedQ1 = data.problem_reframe?.tutorial_q1_selected || "";
      const loadedQ2 = data.problem_reframe?.tutorial_q2_selected || "";

      setTutorialPlanResult(loadedTutorialResult);
      setTutorialQ1Selected(loadedQ1);
      setTutorialQ2Selected(loadedQ2);

      setProblemReframeResult(data.problem_reframe || null);
      setKickoffResult(data.kickoff || null);
      setSubquestionsResult(
        data.subq_list?.length ? { subq_list: data.subq_list } : null
      );
      setAnalysisApproachResult(
        data.analysis_blocks?.length
          ? { analysis_blocks: data.analysis_blocks }
          : null
      );

      if (data.selected_axis_key) {
        setSelectedAxisKey(data.selected_axis_key);
      }
      if (data.selected_axis_text) {
        setSelectedAxisText(data.selected_axis_text);
      }

      setSuccessMessage("ワークスペースを読み込みました。");
    } catch (error) {
      setErrorMessage(`エラー: ${error.message}`);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const isGenerateDisabled =
    loadingOrien || loadingUpload || (extractedTexts.length === 0 && !manualText.trim());

  const isKickoffDisabled =
    loadingKickoff ||
    loadingUpload ||
    loadingOrien ||
    loadingTutorialPlan ||
    tutorialRefreshLoading ||
    !orienOutlineText ||
    !selectedAxisText.trim();

  const isSubquestionsDisabled =
    loadingSubquestions ||
    loadingUpload ||
    loadingOrien ||
    loadingTutorialPlan ||
    tutorialRefreshLoading ||
    loadingKickoff ||
    !orienOutlineText ||
    !selectedAxisText.trim() ||
    !mainQuestion;

  const isAnalysisApproachDisabled =
    analysisApproachLoading ||
    loadingUpload ||
    loadingOrien ||
    loadingTutorialPlan ||
    tutorialRefreshLoading ||
    loadingKickoff ||
    loadingSubquestions ||
    !orienOutlineText ||
    !selectedAxisText.trim() ||
    !kickoffResult ||
    !subquestionsResult?.subq_list?.length;

  const projectType = useMemo(() => {
    const q1Label = getTutorialSelectionLabel(
      tutorialQ1?.options,
      tutorialQ1Selected || tutorialQ1?.recommended_key
    );
    if (q1Label.includes("施策") || q1Label.includes("接点")) {
      return "施策評価整理型";
    }
    if (q1Label.includes("ターゲット") || q1Label.includes("狙う")) {
      return "ターゲット整理型";
    }
    return "市場理解整理型";
  }, [tutorialQ1, tutorialQ1Selected]);

  const checkItems = useMemo(() => {
    const items = [];

    if (!outlineResult) {
      items.push({
        id: "outline",
        sectionId: "section-input",
        label: "1.入力が未実行です",
      });
    }

    if (!tutorialPlanResult) {
      items.push({
        id: "tutorial",
        sectionId: "section-theme-scope",
        label: "2.中心となる課題の見直しが未準備です（任意）",
      });
    }

    // if (!selectedAxisText.trim()) {
    //   items.push({
    //     id: "axis",
    //     sectionId: "section-theme-scope",
    //     label: "3.KON～SQが未実行です",
    //   });
    // }

    if (!kickoffResult?.調査目的?.trim()) {
      items.push({
        id: "purpose",
        sectionId: "section-kon-sq",
        label: "3.KONが未生成です",
      });
    }

    // if (!kickoffResult?.問い?.trim()) {
    //   items.push({
    //     id: "main-question",
    //     sectionId: "section-kon-sq",
    //     label: "問いが未生成です",
    //   });
    // }

    if (!subquestionsResult?.subq_list?.length) {
      items.push({
        id: "subquestions",
        sectionId: "section-kon-sq",
        label: "3.SQが未生成です",
      });
    }

    if (!analysisApproachResult?.analysis_blocks?.length) {
      items.push({
        id: "analysis",
        sectionId: "section-analysis",
        label: "4.分析アプローチが未生成です",
      });
    }

    if (!targetConditionText) {
      items.push({
        id: "target-condition",
        sectionId: "section-target-condition",
        label: "5.調査対象者条件が未生成です",
      });
    }

    if (!researchItemsResult) {
      items.push({
        id: "research-items",
        sectionId: "section-research-items",
        label: "6.調査項目が未生成です",
      });
    }

    return items;
  }, [
    outlineResult,
    tutorialPlanResult,
    selectedAxisText,
    kickoffResult,
    subquestionsResult,
    analysisApproachResult,
    targetConditionText,
    researchItemsResult,
  ]);

  const checkScore = Math.max(60, 100 - checkItems.length * 6);

  const guideSteps = useMemo(() => {
    return [
      {
        id: 1,
        key: "input",
        title: "入力・オリエン整理",
        sectionId: "section-input",
        done: !!outlineResult,
        action: "オリエン資料をアップロードするか、補足メモを入力して「オリエン整理」を実行してください。",
        caution: isGenerateDisabled
          ? "資料アップロード、または補足メモの入力が必要です。"
          : "",
      },
      {
        id: 2,
        key: "theme-scope",
        title: "企画方針調整",
        sectionId: "section-theme-scope",
        done: !!tutorialPlanResult && !!selectedAxisText.trim(),
        action: "推奨された企画方針を確認し、必要に応じて選択肢を変更してください。",
        caution: !outlineResult
          ? "先に 1.入力・オリエン整理 を完了してください。"
          : "",
      },
      {
        id: 3,
        key: "kon-sq",
        title: "KON・SQ生成",
        sectionId: "section-kon-sq",
        done:
          !!kickoffResult?.調査目的?.trim() &&
          !!subquestionsResult?.subq_list?.length,
        action: "まずKONを生成し、その後SQを生成してください。KONの「問い」がSQ生成の起点になります。",
        caution: isKickoffDisabled
          ? "オリエン整理と企画方針調整が揃うと実行できます。"
          : "",
      },
      {
        id: 4,
        key: "analysis",
        title: "分析アプローチ管理",
        sectionId: "section-analysis",
        done: !!analysisApproachResult?.analysis_blocks?.length,
        action: "分析アプローチ候補を生成し、企画書に採用する分析を選択してください。",
        caution: isAnalysisApproachDisabled
          ? "KONとSQが揃うと実行できます。"
          : "",
      },
      {
        id: 5,
        key: "target-condition",
        title: "調査対象者条件",
        sectionId: "section-target-condition",
        done: !!targetConditionText,
        action: "調査対象者条件を生成し、性別・年代・利用状況などの条件を確認してください。",
        caution: !analysisBlocksForView.length
          ? "先に 4.分析アプローチ管理 を完了してください。"
          : "",
      },
      {
        id: 6,
        key: "research-items",
        title: "調査項目生成",
        sectionId: "section-research-items",
        done: !!researchItemsResult,
        action: "調査項目を生成し、スクリーニング項目と本調査項目を確認してください。",
        caution: !targetConditionText
          ? "先に 5.調査対象者条件 を完了してください。"
          : !selectedAnalysisIds.length
          ? "採用する分析アプローチを選択してください。"
          : "",
      },
      {
        id: 7,
        key: "proposal-review",
        title: "企画書レビュー",
        sectionId: "section-proposal-review",
        done: !!proposalReviewResult,
        action: "企画書レビューを実行し、抜け漏れや修正ポイントを確認してください。",
        caution: !researchItemsResult
          ? "先に 6.調査項目生成 を完了してください。"
          : "",
      },
    ];
  }, [
    outlineResult,
    tutorialPlanResult,
    selectedAxisText,
    kickoffResult,
    subquestionsResult,
    analysisApproachResult,
    analysisBlocksForView,
    targetConditionText,
    researchItemsResult,
    proposalReviewResult,
    selectedAnalysisIds,
    isGenerateDisabled,
    isKickoffDisabled,
    isAnalysisApproachDisabled,
  ]);

  const completedGuideSteps = guideSteps.filter((step) => step.done);
  const nextGuideStep = guideSteps.find((step) => !step.done) || null;

  const buildNextGuideReply = () => {
    if (!nextGuideStep) {
      return [
        "1〜7の主要工程は完了しています。",
        "",
        "次は、企画書プレビューを確認し、必要に応じて各ボックスを開いて直接修正してください。",
        "問題なければ、PPTテンプレートを指定して企画書出力へ進めます。",
      ].join("\n");
    }

    return [
      `現在の進捗: ${completedGuideSteps.length} / ${guideSteps.length} 完了`,
      "",
      `次に進める工程は「${nextGuideStep.id}. ${nextGuideStep.title}」です。`,
      "",
      `やること: ${nextGuideStep.action}`,
      nextGuideStep.caution ? `注意: ${nextGuideStep.caution}` : "",
      "",
      `中央ペインの「${nextGuideStep.title}」ボックスを開いて操作してください。`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleJumpToPlanningSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const exportComment = useMemo(() => {
    const q1Label = getTutorialSelectionLabel(
      tutorialQ1?.options,
      tutorialQ1Selected || tutorialQ1?.recommended_key
    );
    return `「${getDisplayProjectName()}」について、現在の企画方針は概ね良好です。特に「${q1Label || "主題未設定"}」を起点に、チュートリアル・KON・SQ・分析アプローチが接続されています。一方で、${
      checkItems[0]?.label || "仕上げ確認"
    } は出力前に見直すと、企画書としてさらに使いやすくなります。`;
  }, [tutorialQ1, tutorialQ1Selected, checkItems]);

  const editableSections = useMemo(() => {
    return {
      "KON_目標": kickoffResult?.目標 || "まだKONは生成されていません。",
      "KON_現状": kickoffResult?.現状 || "まだKONは生成されていません。",
      "KON_ビジネス課題":
        kickoffResult?.ビジネス課題 || "まだKONは生成されていません。",
      "KON_調査目的":
        kickoffResult?.調査目的 || "まだKONは生成されていません。",
      "KON_問い": kickoffResult?.問い || "まだKONは生成されていません。",
      "KON_仮説": kickoffResult?.仮説 || "まだKONは生成されていません。",
      SQ: subquestionsResult?.subq_list?.length
        ? subquestionsResult.subq_list
            .map((item, index) => {
              return [
                `SQ${index + 1}`,
                `subq: ${item.subq || ""}`,
                `axis: ${
                  Array.isArray(item.axis) ? item.axis.join(", ") : item.axis || ""
                }`,
                `items: ${
                  Array.isArray(item.items) ? item.items.join(", ") : item.items || ""
                }`,
              ].join("\n");
            })
            .join("\n\n")
        : "まだSQは生成されていません。",
    };
  }, [kickoffResult, subquestionsResult]);

  const [localSectionDrafts, setLocalSectionDrafts] = useState(editableSections);

  useEffect(() => {
    setLocalSectionDrafts(editableSections);
  }, [kickoffResult]);

  useEffect(() => {
    setLocalSectionDrafts((prev) => ({
      ...prev,
      "SQ設計": editableSections["SQ設計"],
    }));
  }, [subquestionsResult]);

  const handleSectionChange = (key, value) => {
    setLocalSectionDrafts((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEditSq = (sq) => {
    setEditingSqId(sq.id || "");
    setEditingSqValue(sq.subq || "");
  };

  const handleSaveSq = () => {
    if (!editingSqId) return;

    setSubquestionsResult((prev) => {
      if (!prev?.subq_list?.length) return prev;

      return {
        ...prev,
        subq_list: prev.subq_list.map((sq) =>
          sq.id === editingSqId
            ? {
                ...sq,
                subq: editingSqValue,
              }
            : sq
        ),
      };
    });

    setEditingSqId("");
    setEditingSqValue("");
    setSuccessMessage("サブクエスチョンを更新しました。");
  };

  const handleDeleteSq = (sqId) => {
    setSubquestionsResult((prev) => {
      if (!prev?.subq_list?.length) return prev;

      return {
        ...prev,
        subq_list: prev.subq_list.filter((sq) => sq.id !== sqId),
      };
    });

    if (editingSqId === sqId) {
      setEditingSqId("");
      setEditingSqValue("");
    }

    setSuccessMessage("サブクエスチョンを削除しました。");
  };  


  const handleApply = () => {
    setSavingDraft(true);
    window.setTimeout(() => {
      setSavingDraft(false);
      setEditingKey(null);
      setSuccessMessage("UI上の編集内容を保存しました。");
    }, 500);
  };

  const handleExport = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setPptExportError("");

      if (!pptTemplateFile) {
        throw new Error("PPTテンプレートファイルをアップロードしてください。");
      }

      const payload = buildPptPayload();

      if (!payload.items.length) {
        throw new Error("PPTに反映する内容がありません。先に企画内容を生成してください。");
      }

      const formData = new FormData();
      formData.append("template_file", pptTemplateFile);
      formData.append("payload_json", JSON.stringify(payload));

      setPptExportLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/ppt/export`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "PPT出力に失敗しました。");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeTitle = (researchTitle || "企画書").replace(/[\\/:*?"<>|]/g, "");
      const fileName = `${safeTitle}_ppt出力.pptx`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setExported(true);
      setSuccessMessage("PPTを出力しました。");
    } catch (error) {
      setPptExportError(error.message);
      setErrorMessage(`PPT出力エラー: ${error.message}`);
    } finally {
      setPptExportLoading(false);
    }
  };

  const handleExcelExport = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const screeningItems =
        confirmedResearchItems?.confirmed_screening_items ||
        confirmedResearchItems?.screening_items ||
        researchItemsResult?.screening_items ||
        [];

      const analysisItems =
        confirmedResearchItems?.confirmed_analysis_items ||
        confirmedResearchItems?.analysis_items ||
        researchItemsResult?.analysis_items ||
        [];

      if (!screeningItems.length && !analysisItems.length) {
        throw new Error("Excelに出力する調査項目がありません。先に調査項目を生成してください。");
      }

      const payload = {
        project_name: researchTitle || "調査項目案",
        client_name: clientName || "",
        research_title: researchTitle || "",
        screening_items: screeningItems,
        analysis_items: analysisItems,
        meta: {
          generated_at: new Date().toISOString(),
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/excel/research-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Excel出力に失敗しました。");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeTitle = (researchTitle || "調査項目案").replace(/[\\/:*?"<>|]/g, "");
      const fileName = `${safeTitle}_調査項目案.xlsx`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccessMessage("Excelを出力しました。");
    } catch (error) {
      setErrorMessage(`Excel出力エラー: ${error.message}`);
    }
  };

  const chatActions = useMemo(() => {
    return [
      {
        id: "outline",
        stepId: 1,
        title: "入力・オリエン整理",
        sectionId: "section-input",
        canRun: !isGenerateDisabled,
        disabledReason: isGenerateDisabled
          ? "資料アップロード、または補足メモの入力が必要です。"
          : "",
        run: handleGenerateOutline,
        successText: "オリエン整理を実行しました。次は企画方針調整の内容を確認してください。",
        keywords: ["1", "オリエン", "整理", "outline", "入力"],
      },
      {
        id: "kickoff",
        stepId: 3,
        title: "KON生成",
        sectionId: "section-kon-sq",
        canRun: !isKickoffDisabled,
        disabledReason: isKickoffDisabled
          ? "オリエン整理と企画方針調整が完了すると実行できます。"
          : "",
        run: handleGenerateKickoff,
        successText: "KON生成を実行しました。次はSQ生成へ進んでください。",
        keywords: ["3", "KON", "kon", "キックオフ", "調査目的", "問い"],
      },
      {
        id: "subquestions",
        stepId: 3,
        title: "SQ生成",
        sectionId: "section-kon-sq",
        canRun: !isSubquestionsDisabled,
        disabledReason: isSubquestionsDisabled
          ? "KONで「問い」が生成されるとSQ生成を実行できます。"
          : "",
        run: handleGenerateSubquestions,
        successText: "SQ生成を実行しました。次は分析アプローチ管理へ進んでください。",
        keywords: ["SQ", "sq", "サブクエスチョン", "問いの分解"],
      },
      {
        id: "analysis",
        stepId: 4,
        title: "分析アプローチ生成",
        sectionId: "section-analysis",
        canRun: !isAnalysisApproachDisabled,
        disabledReason: isAnalysisApproachDisabled
          ? "KONとSQが揃うと分析アプローチ生成を実行できます。"
          : "",
        run: handleGenerateAnalysisApproach,
        successText: "分析アプローチ生成を実行しました。採用する分析を確認してください。",
        keywords: ["4", "分析", "アプローチ", "analysis"],
      },
      {
        id: "target-condition",
        stepId: 5,
        title: "調査対象者条件生成",
        sectionId: "section-target-condition",
        canRun:
          !targetConditionLoading &&
          !!orienOutlineText &&
          !!kickoffResult &&
          !!subquestionsResult?.subq_list?.length &&
          !!analysisBlocksForView.length,
        disabledReason:
          "オリエン整理、KON、SQ、分析アプローチが揃うと実行できます。",
        run: handleGenerateTargetCondition,
        successText: "調査対象者条件を生成しました。次は調査項目生成へ進んでください。",
        keywords: ["5", "対象者", "条件", "ターゲット"],
      },
      {
        id: "research-items",
        stepId: 6,
        title: "調査項目生成",
        sectionId: "section-research-items",
        canRun:
          !researchItemsLoading &&
          !!orienOutlineText &&
          !!targetConditionText &&
          !!analysisBlocksForView.length &&
          !!selectedAnalysisIds.length,
        disabledReason:
          "調査対象者条件と採用する分析アプローチが揃うと実行できます。",
        run: handleGenerateResearchItems,
        successText: "調査項目を生成しました。次は企画書レビューへ進んでください。",
        keywords: ["6", "調査項目", "設問", "質問項目", "research"],
      },
      {
        id: "proposal-review",
        stepId: 7,
        title: "企画書レビュー",
        sectionId: "section-proposal-review",
        canRun:
          !proposalReviewLoading &&
          !!orienOutlineText &&
          !!kickoffResult &&
          !!subquestionsResult?.subq_list?.length &&
          !!analysisBlocksForView.length &&
          !!targetConditionText &&
          !!researchItemsResult,
        disabledReason:
          "1〜6の主要工程が完了すると企画書レビューを実行できます。",
        run: handleGenerateProposalReview,
        successText: "企画書レビューを実行しました。レビュー結果を確認してください。",
        keywords: ["7", "レビュー", "企画書レビュー", "確認"],
      },
    ];
  }, [
    isGenerateDisabled,
    isKickoffDisabled,
    isSubquestionsDisabled,
    isAnalysisApproachDisabled,
    targetConditionLoading,
    researchItemsLoading,
    proposalReviewLoading,
    orienOutlineText,
    kickoffResult,
    subquestionsResult,
    analysisBlocksForView,
    targetConditionText,
    selectedAnalysisIds,
    researchItemsResult,
  ]);

  const findChatActionById = (actionId) => {
    return chatActions.find((action) => action.id === actionId) || null;
  };

  const detectChatAction = (text) => {
    return (
      chatActions.find((action) =>
        action.keywords.some((keyword) => text.includes(keyword))
      ) || null
    );
  };

  const isExecuteIntent = (text) => {
    return (
      text.includes("実行") ||
      text.includes("お願いします") ||
      text.includes("お願い") ||
      text.includes("進めて") ||
      text.includes("やって") ||
      text.includes("はい") ||
      text.includes("OK") ||
      text.includes("ok")
    );
  };

  const isCancelIntent = (text) => {
    return (
      text.includes("キャンセル") ||
      text.includes("やめる") ||
      text.includes("中止") ||
      text.includes("取り消し")
    );
  };

  const buildActionProposalReply = (action) => {
    if (!action) return buildNextGuideReply();

    if (!action.canRun) {
      return [
        `「${action.title}」はまだ実行できません。`,
        "",
        `理由: ${action.disabledReason}`,
        "",
        "先に必要な工程を完了してください。",
      ].join("\n");
    }

    setPendingChatActionId(action.id);
    handleJumpToPlanningSection(action.sectionId);

    return [
      `「${action.title}」をチャットから実行できます。`,
      "",
      "実行する場合は「実行」と入力してください。",
      "やめる場合は「キャンセル」と入力してください。",
    ].join("\n");
  };

  const executePendingChatAction = async () => {
    const action = findChatActionById(pendingChatActionId);

    if (!action) {
      setPendingChatActionId(null);
      return "実行待ちの操作が見つかりませんでした。もう一度、実行したい工程を指定してください。";
    }

    if (!action.canRun) {
      setPendingChatActionId(null);
      return [
        `「${action.title}」は現在実行できません。`,
        "",
        `理由: ${action.disabledReason}`,
      ].join("\n");
    }

    handleJumpToPlanningSection(action.sectionId);

    try {
      await action.run();
      setPendingChatActionId(null);

      return [
        `「${action.title}」を実行しました。`,
        "",
        action.successText,
      ].join("\n");
    } catch (error) {
      setPendingChatActionId(null);

      return [
        `「${action.title}」の実行中にエラーが発生しました。`,
        "",
        error?.message || "詳細不明のエラーです。中央ペインのエラー表示も確認してください。",
      ].join("\n");
    }
  };

  const buildAgentReply = (message) => {
    const text = message.trim();

    if (!text) {
      return "入力内容を確認できませんでした。メッセージを入れてください。";
    }

    if (pendingChatActionId) {
      if (isCancelIntent(text)) {
        setPendingChatActionId(null);
        return "操作実行をキャンセルしました。次に進めたい場合は「次は？」と入力してください。";
      }

      if (isExecuteIntent(text)) {
        return null;
      }

      const pendingAction = findChatActionById(pendingChatActionId);
      return [
        `現在「${pendingAction?.title || "前回の操作"}」が実行待ちです。`,
        "",
        "実行する場合は「実行」、やめる場合は「キャンセル」と入力してください。",
      ].join("\n");
    }

    const action = detectChatAction(text);

    if (
      action &&
      (text.includes("実行") ||
        text.includes("生成") ||
        text.includes("進め") ||
        text.includes("やって") ||
        text.includes("お願い"))
    ) {
      return buildActionProposalReply(action);
    }

    if (
      text.includes("次") ||
      text.includes("なに") ||
      text.includes("何") ||
      text.includes("案内") ||
      text.includes("ガイド") ||
      text.includes("どこ")
    ) {
      return buildNextGuideReply();
    }

    if (action) {
      return buildActionProposalReply(action);
    }

    return buildNextGuideReply();
  };

  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatSending(true);

    try {
      let replyText = buildAgentReply(text);

      if (pendingChatActionId && isExecuteIntent(text)) {
        replyText = await executePendingChatAction();
      }

      const replyMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        text: replyText || buildNextGuideReply(),
      };

      setChatMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      const errorReply = {
        id: `msg-${Date.now()}-assistant-error`,
        role: "assistant",
        text: `チャット操作中にエラーが発生しました。\n\n${error?.message || "詳細不明のエラーです。"}`,
      };

      setChatMessages((prev) => [...prev, errorReply]);
    } finally {
      setChatSending(false);
    }
  };

  const handleChatInputKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendChat();
    }
  };

  const previewSlides = useMemo(() => {
    const titleText =
      researchTitle?.trim() ||
      tutorialPlanResult?.title ||
      "企画書タイトル未設定";

    const clientText =
      clientName?.trim() ||
      tutorialPlanResult?.client_name ||
      "クライアント名未設定";

    const projectTypeText = projectType || "調査タイプ未設定";

    const orienText =
      outlineResult?.orien_outline_ai_draft ||
      outlineResult?.orien_outline_text ||
      "";
    const goalText = localSectionDrafts["KON_目標"] || "";
    const currentStatusText = localSectionDrafts["KON_現状"] || "";
    const businessIssueText = localSectionDrafts["KON_ビジネス課題"] || "";
    const purposeText = localSectionDrafts["KON_調査目的"] || "";
    const questionText = localSectionDrafts["KON_問い"] || "";
    const hypothesisText = localSectionDrafts["KON_仮説"] || "";

    const sqList = Array.isArray(subquestionsResult?.subq_list)
      ? subquestionsResult.subq_list.map((sq, index) =>
          [
            `SQ${index + 1}: ${sq.subq || ""}`,
            `axis: ${
              Array.isArray(sq.axis) ? sq.axis.join(", ") : sq.axis || ""
            }`,
            `items: ${
              Array.isArray(sq.items) ? sq.items.join(", ") : sq.items || ""
            }`,
          ].join("\n")
        )
      : [];

    const analysisApproachList = Array.isArray(analysisBlocksForView)
      ? analysisBlocksForView.map((block, index) => ({
          id: block.id || `analysis-${index + 1}`,
          title: block.subq || `分析アプローチ${index + 1}`,
          approach: block.approach || "",
          hypothesis: block.hypothesis || "",
          axis: Array.isArray(block.axis) ? block.axis : block.axis ? [block.axis] : [],
          items: Array.isArray(block.items) ? block.items : block.items ? [block.items] : [],
          selected: selectedAnalysisIds.includes(block.id),
        }))
      : [];

    return [
      {
        id: "cover",
        title: "表紙",
        type: "sections",
        content: [
          { heading: "調査タイトル", body: titleText },
          { heading: "クライアント名", body: clientText },
          { heading: "調査タイプ", body: projectTypeText },
        ],
      },
      {
        id: "research-background",
        title: "調査背景",
        type: "sections",
        content: [
          { heading: "目標", body: goalText },
          { heading: "現状", body: currentStatusText },
          { heading: "ビジネス課題", body: businessIssueText },
          { heading: "調査目的", body: purposeText },
          { heading: "問い", body: questionText },
          { heading: "仮説", body: hypothesisText },
        ],
      },
      {
        id: "sq-design",
        title: "SQ設計",
        type: "list",
        content: sqList,
      },
      {
        id: "analysis-overview",
        title: "分析アプローチ",
        type: "analysis_list",
        content: analysisApproachList,
      },
      {
        id: "target-condition",
        title: "対象者条件",
        type: "text",
        content: targetConditionText,
      },
      {
        id: "question-items-screening",
        title: "調査項目案（スクリーニング調査）",
        type: "matrix",
        content: {
          columns: [
            { key: "category", label: "区分" },
            { key: "number", label: "通し番号" },
            { key: "question", label: "調査項目" },
            { key: "questionType", label: "質問形式" },
            { key: "choicesExample", label: "選択肢例" },
          ],
          rows: screeningMatrixRows,
          emptyMessage: "まだスクリーニング調査用項目はありません。",
        },
      },
      {
        id: "question-items-main",
        title: "調査項目案（本調査）",
        type: "matrix",
        content: {
          columns: [
            { key: "subq", label: "サブクエスチョン" },
            { key: "number", label: "通し番号" },
            { key: "question", label: "調査項目" },
            { key: "questionType", label: "質問形式" },
            { key: "choicesExample", label: "選択肢例" },
            { key: "reason", label: "補足" },
          ],
          rows: mainMatrixRows,
          emptyMessage: "まだ本調査用項目はありません。",
        },
      },
    ];
  }, [
    researchTitle,
    tutorialPlanResult,
    clientName,
    projectType,
    outlineResult,
    localSectionDrafts,
    subquestionsResult,
    analysisBlocksForView,
    selectedAnalysisIds,
    targetConditionText,
    confirmedScreeningItems,
    confirmedAnalysisItems,
    screeningMatrixRows,
    mainMatrixRows,
  ]);

  const selectedPreviewSlide = useMemo(() => {
    return (
      previewSlides.find((slide) => slide.id === selectedOverviewSlideId) ||
      previewSlides[0] ||
      null
    );
  }, [previewSlides, selectedOverviewSlideId]);

  useEffect(() => {
    if (!previewSlides.length) {
      setSelectedOverviewSlideId("cover");
      return;
    }

    const exists = previewSlides.some(
      (slide) => slide.id === selectedOverviewSlideId
    );

    if (!exists) {
      setSelectedOverviewSlideId(previewSlides[0].id);
    }
  }, [previewSlides, selectedOverviewSlideId]);

  const q1Label = getTutorialSelectionLabel(
    tutorialQ1?.options,
    tutorialQ1Selected || tutorialQ1?.recommended_key
  );

  const handleOverviewSlideClick = (slide) => {
    if (slide.id === "analysis-overview") {
      setPreviewTab("analysis");
      return;
    }

    setPreviewTab("overview");
    setSelectedOverviewSlideId(slide.id);
  };



  const analysisSheets = useMemo(() => {
    const activeBlocks = analysisBlocksForView.filter((block) =>
      selectedAnalysisIds.includes(block.id)
    );

    if (!activeBlocks.length) return [];

    return activeBlocks.map((block, index) => ({
      id: getAnalysisBlockId(block),
      title: block.subq || `分析シート ${index + 1}`,
      objective: block.approach || "分析アプローチ未設定",
      axis: normalizeList(block.axis),
      questions: normalizeList(block.items),
      insight: block.hypothesis || "仮説未設定",
      chartType: "分析アプローチ",
      enabled: true,
      priority: block.priority === "recommended" || index < 3,
      rawBlock: block,
    }));
  }, [analysisBlocksForView, selectedAnalysisIds]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 md:p-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 xl:flex-row xl:items-start">
        <main className="min-w-0 flex-1 xl:min-w-[720px]">
          <div className="space-y-8">

            <div className="min-w-0 flex-1">
              <div className="mx-auto max-w-7xl space-y-8">
                <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
                        <Sparkles className="h-4 w-4" />
                        市場調査企画書ドラフト作成ツール
                      </div>
                      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        「一回、企画書を埋めちゃって」
                      </h1>
                      <p className="text-base leading-7 text-slate-600">
                        入力 → 企画方針調整 → PPTプレビュー → 部分編集 → 出力、の順で進めるUIです。
                      </p>
                    </div>

                    <div className="grid min-w-[280px] grid-cols-2 gap-3">
                      {/* <button
                        type="button"
                        onClick={handleLoadWorkspace}
                        disabled={workspaceLoading}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {workspaceLoading ? "読込中..." : "保存済み案件"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveWorkspace}
                        disabled={workspaceSaving}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {workspaceSaving ? "保存中..." : "保存"}
                      </button> */}
                    </div>
                  </div>
                </header>
            
                <StatusMessages
                  errorMessage={errorMessage}
                  successMessage={successMessage}
                  kickoffError={kickoffError}
                  subquestionsError={subquestionsError}
                  analysisApproachError={analysisApproachError}
                  analysisSelectionError={analysisSelectionError}
                  tutorialError={tutorialError}
                  targetConditionError={targetConditionError}
                  researchItemsError={researchItemsError}                  
                />

                {isCheckSummaryVisible && (
                  <PlanningCheckSummary
                    items={checkItems}
                    score={checkScore}
                    onJump={handleJumpToPlanningSection}
                    onClose={() => setIsCheckSummaryVisible(false)}
                  />
                )}

                {!isCheckSummaryVisible && (
                  <div className="mb-4">
                    <button
                      onClick={() => setIsCheckSummaryVisible(true)}
                      className="text-xs text-slate-500 underline hover:text-slate-700"
                    >
                      企画の抜け漏れチェックを表示
                    </button>
                  </div>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">企画書プレビュー</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        左のPPT項目一覧を押すと、対応する内容を右側プレビューに表示します。
                      </p>
                    </div>
                    <div className="preview-export-actions">
                      <div className="ppt-template-upload-inline">
                        <label className="field-label">PPTテンプレート</label>
                        <input
                          type="file"
                          accept=".pptx"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setPptTemplateFile(file);
                            setPptExportError("");
                          }}
                        />

                        {pptTemplateFile && (
                          <p className="helper-text">選択中: {pptTemplateFile.name}</p>
                        )}
                      </div>

                      <div className="preview-export-buttons">
                        <button
                          type="button"
                          className="export-action-button export-action-button-primary"
                          onClick={handleExport}
                          disabled={pptExportLoading || !pptTemplateFile}
                        >
                          {pptExportLoading ? "企画書を出力中..." : "企画書出力"}
                        </button>

                        <button
                          type="button"
                          className="export-action-button export-action-button-secondary"
                          onClick={handleExcelExport}
                        >
                          調査項目一覧を出力
                        </button>
                      </div>

                      {pptExportError && <p className="error-text">{pptExportError}</p>}
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("overview")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                        previewTab === "overview"
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      企画全体
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("analysis")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                        previewTab === "analysis"
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      分析アプローチ
                    </button>
                  </div>

                  {previewTab === "overview" ? (
                    <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
                      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        {previewSlides.map((slide, i) => {
                          const active = selectedOverviewSlideId === slide.id;

                          return (
                            <button
                              key={slide.id}
                              type="button"
                              onClick={() => handleOverviewSlideClick(slide)}
                              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                                active
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                  active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {i + 1}
                              </span>
                              <span className="text-left">{slide.title}</span>
                            </button>
                          );
                        })}                        
                      </div>

                      <OverviewSlidePreview slide={selectedPreviewSlide} />
                    </div>
                  ) : (
                    <AnalysisPreviewPanel
                      projectName={getDisplayProjectName()}
                      sheets={analysisSheets}
                      selectedId={selectedAnalysisId}
                      onSelect={handleSelectAnalysisPreview}
                    />
                  )}

                  {exported && (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      出力のモック動作です。実装時はここを download ボタンや API 結果表示に接続してください。
                    </div>
                  )}
                </section>

              <div id="section-input" className="scroll-mt-6">
                <Collapsible
                  title="1. 入力"
                  defaultOpen={true}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      編集可
                    </span>
                  }
                >
                  <div className="pt-1">
                    <p className="mb-6 text-sm text-slate-600">
                      オリエン資料と補足情報を入力し、企画の起点を整えます。
                    </p>
                    <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-input")} />
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">クライアント名</label>
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                              placeholder="例：株式会社○○"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">調査名</label>
                            <input
                              type="text"
                              value={researchTitle}
                              onChange={(e) => setResearchTitle(e.target.value)}
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                              placeholder="例：新サービス受容性調査"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                              <Upload className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">オリエン資料をアップロード</div>
                              <div className="text-xs text-slate-500">
                                PDF / PPTX / DOCX / XLSX / TXT / ZIP
                              </div>
                            </div>
                          </div>

                          <FileUpload
                            onUploadComplete={handleUploadComplete}
                            onUploadStart={handleUploadStart}
                            onUploadError={handleUploadError}
                          />

                          {loadingUpload && (
                            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                              アップロード中...
                            </div>
                          )}

                          {documents.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {documents.map((doc, index) => (
                                <span
                                  key={`${doc.file_name}-${index}`}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                                >
                                  {doc.file_name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">補足メモ</label>
                          <textarea
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                            placeholder="例：営業部門から、比較検討段階での弱さが指摘されている"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateOutline}
                          disabled={isGenerateDisabled}
                          className="w-full rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadingOrien || loadingTutorialPlan
                            ? "オリエン整理中..."
                            : "オリエン整理"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Collapsible>
              </div>

              <div id="section-theme-scope" className="scroll-mt-6">
                <Collapsible
                  title="2. 中心テーマを見直す"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      任意
                    </span>
                  }
                >
                  <div className="space-y-5 pt-1">

                    {!tutorialPlanResult ? (
                      <div className="space-y-3 text-sm text-slate-500">
                        <div>まず「1. 入力」でオリエン整理を実行してください。</div>
                        <div>主題や範囲の見直しは、その結果をもとに行います。</div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600">
                          オリエン整理後の企画方針を確認し、必要に応じて主題や範囲を見直します。
                        </p>
                        <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-theme-scope")} />
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-2 text-sm font-semibold text-slate-900">
                            現在の企画方針
                          </div>
                          <div className="space-y-2 text-sm text-slate-700">
                            <div>
                              <span className="font-medium text-slate-900">主題:</span>{" "}
                              {getTutorialSelectionLabel(
                                tutorialQ1?.options,
                                tutorialQ1Selected || tutorialQ1?.recommended_key
                              ) || "未設定"}
                            </div>
                            <div>
                              <span className="font-medium text-slate-900">範囲:</span>{" "}
                              {getTutorialSelectionLabel(
                                tutorialQ2?.options,
                                tutorialQ2Selected || tutorialQ2?.recommended_key
                              ) || "未設定"}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                          <div>この調査で一番知りたいことを問い直すこともできます。</div>
                          <div>必要に応じて、前提の整理を含めて提案することもできます。</div>
                          <div>そのまま進める場合は変更不要です。</div>
                        </div>

                        <div className="space-y-4">
                          <QuestionBlock
                            title={tutorialQ1?.title || "Q1"}
                            description={tutorialQ1?.description || ""}
                            options={tutorialQ1?.options || []}
                            selectedKey={tutorialQ1Selected}
                            loading={tutorialRefreshLoading}
                            onChange={handleTutorialQ1Change}
                          />

                          <QuestionBlock
                            title={tutorialQ2?.title || "Q2"}
                            description={tutorialQ2?.description || ""}
                            options={tutorialQ2?.options || []}
                            selectedKey={tutorialQ2Selected}
                            loading={tutorialRefreshLoading}
                            onChange={handleTutorialQ2Change}
                          />
                        </div>
                      </>
                    )}

                  </div>
                </Collapsible>
              </div>

              <div id="section-kon-sq" className="scroll-mt-6">
                <Collapsible
                  title="3. KON～SQ編集"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      編集可
                    </span>
                  }
                >
                  <div className="space-y-6 pt-1">
                    <p className="text-sm text-slate-600">
                      KON と SQ を確認・修正するセクションです。
                    </p>
                    <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-kon-sq")} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleGenerateKickoff}
                          disabled={isKickoffDisabled}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadingKickoff ? "KON生成中..." : "KON生成"}
                        </button>
                        <button
                          type="button"
                          onClick={handleGenerateSubquestions}
                          disabled={isSubquestionsDisabled}
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadingSubquestions ? "SQ生成中..." : "SQ生成"}
                        </button>
                        {/* <button
                          type="button"
                          onClick={handleApply}
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                          {savingDraft ? "保存中..." : "保存"}
                        </button> */}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">KON</div>
                        <div className="space-y-3">
                          {[
                            ["KON_目標", "目標"],
                            ["KON_現状", "現状"],
                            ["KON_ビジネス課題", "ビジネス課題"],
                            ["KON_調査目的", "調査目的"],
                            ["KON_問い", "問い"],
                            ["KON_仮説", "仮説"],
                          ].map(([key, label]) => {
                            const isEditing = editingKey === key;

                            return (
                              <div
                                key={key}
                                className="grid items-start gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-3 md:grid-cols-[120px_minmax(0,1fr)_96px]"
                              >
                                <div className="flex items-center px-2 py-3 text-sm font-semibold text-slate-900">
                                  {label}
                                </div>

                                <div>
                                  {isEditing ? (
                                    <textarea
                                      value={localSectionDrafts[key]}
                                      onChange={(e) => handleSectionChange(key, e.target.value)}
                                      className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                  ) : (
                                    <div className="min-h-[56px] whitespace-pre-wrap rounded-xl bg-white px-3 py-4 text-sm leading-6 text-slate-700">
                                      {localSectionDrafts[key]}
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setEditingKey((prev) => (prev === key ? null : key))}
                                  className="rounded-xl bg-white px-3 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
                                >
                                  {isEditing ? "閉じる" : "編集"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">SQ構造</div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="mb-2 text-xs font-medium text-slate-500">
                              メインクエスチョン
                            </div>
                            <div className="text-sm font-semibold leading-7 text-slate-900">
                              {localSectionDrafts["KON_問い"] || "まだメインクエスチョンは生成されていません。"}
                            </div>
                          </div>

                          {!subquestionsResult?.subq_list?.length ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                              まだサブクエスチョンは生成されていません。
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {subquestionsResult.subq_list.map((sq, index) => {
                                const sqId = sq.id || `sq-${index}`;
                                const isEditing = editingSqId === sqId;

                                return (
                                  <div
                                    key={sqId}
                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                  >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white">
                                          SQ{index + 1}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                          サブクエスチョン
                                        </span>
                                      </div>

                                      <div className="flex gap-2">
                                        {isEditing ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={handleSaveSq}
                                              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                            >
                                              保存
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingSqId("");
                                                setEditingSqValue("");
                                              }}
                                              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                              キャンセル
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => handleEditSq({ ...sq, id: sqId })}
                                              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                              編集
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteSq(sqId)}
                                              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                              削除
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {isEditing ? (
                                      <textarea
                                        value={editingSqValue}
                                        onChange={(e) => setEditingSqValue(e.target.value)}
                                        className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-7 text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                                      />
                                    ) : (
                                      <div className="border-l-4 border-slate-200 pl-4 text-sm leading-7 text-slate-900">
                                        {sq.subq || "未設定"}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapsible>
              </div>

              <div id="section-analysis" className="scroll-mt-6">
                <Collapsible
                  title="4. 分析アプローチ管理"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      編集可
                    </span>
                  }
                >
                  <div className="pt-1">
                    <p className="mb-4 text-sm text-slate-600">
                      推奨アプローチを確認し、採用する分析アプローチを選択します。
                    </p>
                    <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-analysis")} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleGenerateAnalysisApproach}
                          disabled={isAnalysisApproachDisabled}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {analysisApproachLoading ? "分析生成中..." : "分析アプローチ生成"}
                        </button>

                        {/* <button
                          type="button"
                          onClick={handleApplyAnalysisSelection}
                          disabled={
                            analysisSelectionLoading ||
                            analysisApproachLoading ||
                            !analysisBlocksForView.length
                          }
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {analysisSelectionLoading ? "反映中..." : "選択を反映"}
                        </button>

                        <button
                          type="button"
                          onClick={handleResetAnalysisSelection}
                          disabled={analysisApproachLoading || !analysisBlocksForView.length}
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          初期状態に戻す
                        </button> */}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                          採用中 {selectedAnalysisIds.length} / {maxSelectableAnalysis}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        推奨 {recommendedAnalysisBlocks.length} 件
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        候補 {candidateAnalysisBlocks.length} 件
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        非推奨 {excludedAnalysisBlocks.length} 件
                      </div>
                    </div>

                    {!analysisBlocksForView.length ? (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                        まだ分析アプローチは生成されていません。
                        「分析アプローチ生成」を押すと、ここに推奨・候補一覧が表示されます。
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-4 lg:grid-cols-[320px_1fr]">
                        <div className="space-y-4">
                          <AnalysisSelectionSection
                            title="推奨アプローチ"
                            description="主問いへの寄与が高く、初期状態で採用される候補です。"
                            items={recommendedAnalysisBlocks}
                            selectedAnalysisIds={selectedAnalysisIds}
                            selectedPreviewId={selectedAnalysisId}
                            onToggle={handleToggleAnalysisSelection}
                            onPreview={handleSelectAnalysisPreview}
                          />

                          <AnalysisSelectionSection
                            title="候補アプローチ"
                            description="必要に応じて追加できる補助候補です。"
                            items={candidateAnalysisBlocks}
                            selectedAnalysisIds={selectedAnalysisIds}
                            selectedPreviewId={selectedAnalysisId}
                            onToggle={handleToggleAnalysisSelection}
                            onPreview={handleSelectAnalysisPreview}
                          />

                          {excludedAnalysisBlocks.length > 0 && (
                            <Collapsible
                              title={`非推奨アプローチ（${excludedAnalysisBlocks.length}件）`}
                              defaultOpen={false}
                              action={
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                  参考
                                </span>
                              }
                            >
                              <div className="space-y-3">
                                {excludedAnalysisBlocks.map((block) => (
                                  <AnalysisSelectionCard
                                    key={block.id}
                                    block={block}
                                    isSelected={selectedAnalysisIds.includes(block.id)}
                                    isPreviewing={selectedAnalysisId === block.id}
                                    onToggle={() => handleToggleAnalysisSelection(block.id)}
                                    onPreview={() => handleSelectAnalysisPreview(block.id)}
                                  />
                                ))}
                              </div>
                            </Collapsible>
                          )}
                        </div>

                        <AnalysisApproachDetailPanel
                          block={selectedAnalysisBlock}
                          isSelected={
                            selectedAnalysisBlock
                              ? selectedAnalysisIds.includes(selectedAnalysisBlock.id)
                              : false
                          }
                          onToggleSelected={
                            selectedAnalysisBlock
                              ? () => handleToggleAnalysisSelection(selectedAnalysisBlock.id)
                              : undefined
                          }
                          onApplySelection={handleApplyAnalysisSelection}
                          analysisSelectionLoading={analysisSelectionLoading}
                        />
                      </div>
                    )}
                  </div>
                </Collapsible>
              </div>

              <div id="section-target-condition" className="scroll-mt-6">
                <Collapsible
                  title="5. 調査対象者条件"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      編集可
                    </span>
                  }
                >
                  <div className="pt-1">
                    <p className="mb-4 text-sm text-slate-600">
                      オリエン整理、KON、SQ、分析アプローチを踏まえて対象者条件を生成します。
                    </p>
                    <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-target-condition")} />
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-900">
                          条件メモ
                        </div>
                        <textarea
                          value={targetConditionMemo}
                          onChange={(e) => setTargetConditionMemo(e.target.value)}
                          className="min-h-[180px] w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                          placeholder="例：20〜40代女性、直近3か月購入者、競合ブランド併用者を含む など"
                        />

                        <button
                          type="button"
                          onClick={handleGenerateTargetCondition}
                          disabled={targetConditionLoading}
                          className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {targetConditionLoading
                            ? "調査対象者条件を生成中..."
                            : "調査対象者条件を生成"}
                        </button>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-900">
                          生成結果
                        </div>
                        <div className="min-h-[240px] whitespace-pre-wrap rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                          {targetConditionResult ||
                            "まだ調査対象者条件は生成されていません。"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapsible>
              </div>

              <div id="section-research-items" className="scroll-mt-6">
                <Collapsible
                  title="6. 調査項目"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      編集可
                    </span>
                  }
                >
                  <div className="pt-1">
                    <p className="mb-4 text-sm text-slate-600">
                      スクリーニング調査用と本調査用の調査項目を生成し、絞り込み・採用確定を行います。
                    </p>
                    <BlockAlert items={checkItems.filter((item) => item.sectionId === "section-research-items")} />
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleGenerateResearchItems}
                          disabled={researchItemsLoading}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {researchItemsLoading ? "調査項目生成中..." : "調査項目を生成"}
                        </button>

                        {/* <button
                          type="button"
                          onClick={handleConfirmResearchItems}
                          disabled={
                            researchItemsConfirmLoading ||
                            !researchItemsResult?.analysis_items?.length
                          }
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {researchItemsConfirmLoading ? "確定中..." : "採用項目を確定"}
                        </button> */}
                      </div>
                    </div>

                    {!researchItemsResult ? (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                        まだ調査項目は生成されていません。
                        先に「調査対象者条件」と「分析アプローチ」を整えたうえで、
                        「調査項目を生成」を押してください。
                      </div>
                    ) : (
                      <div className="mt-6 space-y-8">
                        <div>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">
                                1セット目：スクリーニング調査用
                              </h3>
                              <p className="text-sm text-slate-500">
                                対象者条件を満たすかを確認するためのスクリーニング設問です。
                              </p>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                              {researchItemsResult?.screening_items?.length || 0}問
                            </span>
                          </div>

                          <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    スクリーニング調査用
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    通し番号
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    調査項目
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    質問形式
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    選択肢例
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {(researchItemsResult?.screening_items || []).map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-4 py-3 text-slate-600">
                                      スクリーニング調査用
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                      {item.number}
                                    </td>
                                    <td className="px-4 py-3 text-slate-900">
                                      {item.question}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                      {item.question_type}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                      {Array.isArray(item.choices_example)
                                        ? item.choices_example.join(" / ")
                                        : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">
                                2セット目：本調査用
                              </h3>
                              <p className="text-sm text-slate-500">
                                選択された分析アプローチの使用設問・比較軸を元に生成した設問です。
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <label className="text-sm text-slate-600">
                                本調査用項目を何問に絞り込むか
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={analysisQuestionLimit}
                                onChange={(e) => setAnalysisQuestionLimit(e.target.value)}
                                className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                              />
                              <button
                                type="button"
                                onClick={handleShortlistResearchItems}
                                disabled={
                                  researchItemsShortlistLoading ||
                                  !researchItemsResult?.analysis_items?.length
                                }
                                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {researchItemsShortlistLoading ? "絞り込み中..." : "絞り込み"}
                              </button>

                              <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                                全 {researchItemsResult?.analysis_items?.length || 0}問
                              </span>
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                                採用{" "}
                                {(researchItemsResult?.analysis_items || []).filter(
                                  (item) => item.adoption_status === "adopted"
                                ).length}
                                問
                              </span>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    サブクエスチョン
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    通し番号
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    調査項目
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    質問形式
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    選択肢例
                                  </th>
                                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    採用/非採用
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {(researchItemsResult?.analysis_items || []).map((item) => {
                                  const isAdopted = item.adoption_status === "adopted";

                                  return (
                                    <tr key={item.id}>
                                      <td className="px-4 py-3 text-slate-600">
                                        {item.subq}
                                      </td>
                                      <td className="px-4 py-3 text-slate-600">
                                        {item.number}
                                      </td>
                                      <td className="px-4 py-3 text-slate-900">
                                        <div>{item.question}</div>
                                        {item.reason && (
                                          <div className="mt-1 text-xs text-slate-500">
                                            {item.reason}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-slate-600">
                                        {item.question_type}
                                      </td>
                                      <td className="px-4 py-3 text-slate-600">
                                        {Array.isArray(item.choices_example)
                                          ? item.choices_example.join(" / ")
                                          : ""}
                                      </td>
                                      <td className="px-4 py-3">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleResearchItemAdoption(item.id)}
                                          className={`rounded-xl px-3 py-2 text-xs font-medium ${
                                            isAdopted
                                              ? "bg-slate-900 text-white hover:bg-slate-800"
                                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                          }`}
                                        >
                                          {isAdopted ? "採用" : "非採用"}
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Collapsible>                
              </div>

                <Collapsible
                  title="7. 企画書レビュー"
                  defaultOpen={false}
                  action={
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                      レビュー
                    </span>
                  }
                >
                  <div className="pt-1">
                    <p className="mb-4 text-sm text-slate-600">
                      6までに生成した企画書案を、オリエン整理の内容と照合し、整合している点・懸念点・修正提案を確認します。
                    </p>

                    <button
                      type="button"
                      onClick={handleGenerateProposalReview}
                      disabled={proposalReviewLoading}
                      className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {proposalReviewLoading ? "レビュー中..." : "企画書をレビューする"}
                    </button>

                    {proposalReviewError && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {proposalReviewError}
                      </div>
                    )}

                    {proposalReviewResult && (
                      <div className="mt-5 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-sm font-semibold text-slate-900">
                            総合評価：{proposalReviewResult.score ?? "-"}点
                          </div>
                          <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {proposalReviewResult.overall_comment}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="mb-2 text-sm font-semibold text-emerald-800">
                              良い点
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-emerald-800">
                              {(proposalReviewResult.good_points || []).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="mb-2 text-sm font-semibold text-amber-800">
                              懸念点
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-amber-800">
                              {(proposalReviewResult.concerns || []).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <div className="mb-2 text-sm font-semibold text-blue-800">
                              修正提案
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-blue-800">
                              {(proposalReviewResult.recommended_fixes || []).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Collapsible>
                    
              </div>
            </div>
          </div>
        </main>

        <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:w-[440px] xl:min-w-[400px] xl:max-w-[480px] xl:shrink-0 self-start">
          {/* ここにチャット欄を入れる */}
          <section className="flex h-full min-h-[720px] flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">チャット欄</h2>
              <p className="mt-1 text-sm text-slate-600">
                ツール操作エージェント想定の対話UIです。
              </p>
            </div>

            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 pr-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
                        message.role === "user"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      <div
                        className={`mb-1 text-[11px] font-semibold ${
                          message.role === "user" ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {message.role === "user" ? "あなた" : "エージェント"}
                      </div>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                  </div>
                ))}

                {chatSending && (
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm">
                      <div className="mb-1 text-[11px] font-semibold text-slate-400">
                        エージェント
                      </div>
                      <div>考え中...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="mb-2 text-sm font-medium text-slate-900">チャット入力</div>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatInputKeyDown}
                className="min-h-[120px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="例：まず何をする？ / 次は？ / 実行 / キャンセル"
              />
              <div className="mt-2 text-xs text-slate-500">
                Ctrl+Enter / Cmd+Enter で送信
              </div>
              <button
                type="button"
                onClick={handleSendChat}
                disabled={chatSending || !chatInput.trim()}
                className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {chatSending ? "送信中..." : "送信"}
              </button>
            </div>
          </section>          

        </aside>
      </div>
    </div>

  );

  function getDisplayProjectName() {
    const client = clientName.trim();
    const title = researchTitle.trim();

    if (client && title) return `${client}_${title}`;
    if (title) return title;
    if (client) return client;
    return "市場調査企画ドラフト";
  }
}

function PlanningCheckSummary({ items, score, onJump, onClose }) {
  const visibleItems = items.slice(0, 3);

  return (
    <section className="sticky top-4 z-20 rounded-3xl border border-amber-200 bg-amber-50/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            企画の抜け漏れチェック
            <span className="rounded-full bg-white px-2 py-1 text-xs text-amber-700">
              企画完成度 {score}%
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600">
            企画全体の未生成・未確定ポイントを確認します。
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {items.length === 0 ? (
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700">
                大きな抜け漏れは見当たりません
              </span>
            ) : (
              visibleItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onJump?.(item.sectionId)}
                  className="rounded-full border border-amber-200 bg-white px-3 py-1 text-left text-xs text-slate-700 hover:bg-amber-100"
                >
                  {item.label}
                </button>
              ))
            )}

            {items.length > 3 && (
              <span className="rounded-full bg-white px-3 py-1 text-xs text-amber-700">
                ほか {items.length - 3} 件
              </span>
            )}
          </div>
        </div>

        {/* ✕ボタン */}
        <button
          onClick={onClose}
          className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </section>
  );
}

function BlockAlert({ items }) {
  if (!items?.length) return null;

  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        このブロックで確認すること
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="text-sm leading-6 text-slate-700">
            ・{item.label}
          </div>
        ))}
      </div>
    </div>
  );
}


function StatusMessages({
  errorMessage,
  successMessage,
  kickoffError,
  subquestionsError,
  analysisApproachError,
  analysisSelectionError,
  tutorialError,
  targetConditionError,
  researchItemsError,
}) {
  const messages = [
    errorMessage ? { type: "error", text: errorMessage } : null,
    tutorialError ? { type: "error", text: tutorialError } : null,
    kickoffError ? { type: "error", text: kickoffError } : null,
    subquestionsError ? { type: "error", text: subquestionsError } : null,
    analysisApproachError ? { type: "error", text: analysisApproachError } : null,
    analysisSelectionError
      ? { type: "error", text: analysisSelectionError }
      : null,
    targetConditionError ? { type: "error", text: targetConditionError } : null,
    researchItemsError ? { type: "error", text: researchItemsError } : null,
    successMessage ? { type: "success", text: successMessage } : null,
  ].filter(Boolean);

  if (!messages.length) return null;

  return (
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <div
          key={`${msg.type}-${index}`}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            msg.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {msg.type === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

function QuestionBlock({ title, description, options, selectedKey, loading, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1 text-base font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mb-4 text-sm leading-6 text-slate-600">{description}</div>
      ) : null}

      <div className="space-y-3">
        {options.map((option) => {
          const active = selectedKey === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              disabled={loading}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="font-semibold">{option.title}</div>
                {option.recommended && (
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    推奨
                  </span>
                )}
              </div>
              <div className={`text-sm leading-6 ${active ? "text-slate-200" : "text-slate-600"}`}>
                {option.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EditableSectionCard({ title, body, isEditing, onEdit, onChange }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">{title}</div>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs">
          UI先行
        </span>
      </div>

      {isEditing ? (
        <textarea
          value={body}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[180px] w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-slate-300"
        />
      ) : (
        <div className="min-h-[180px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-white px-3 py-4 text-sm leading-6 text-slate-700">
          {body}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
        >
          <Pencil className="h-4 w-4" />
          {isEditing ? "閉じる" : "編集"}
        </button>
      </div>
    </div>
  );
}

function OverviewSlidePreview({ slide }) {
  if (!slide) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 text-sm text-slate-500">
          スライドを選択してください。
        </div>
      </div>
    );
  }

  const renderMatrix = () => {
    const columns = slide.content?.columns || [];
    const rows = slide.content?.rows || [];
    const emptyMessage =
      slide.content?.emptyMessage || "まだ内容は生成されていません。";

    return (
      <div className="space-y-4">
        <div className="text-2xl font-semibold">{slide.title}</div>

        {!rows.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-5 text-sm text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left font-semibold text-slate-700"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {columns.map((col) => (
                      <td
                        key={`${rowIndex}-${col.key}`}
                        className="px-4 py-3 align-top text-slate-700"
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {row[col.key] || ""}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderAnalysisList = () => {
    const items = slide.content || [];

    return (
      <div className="space-y-4">
        <div className="text-2xl font-semibold">{slide.title}</div>

        {!items.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-5 text-sm text-slate-500">
            まだ分析アプローチは生成されていません。
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-xl border border-white bg-white/80 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="text-sm font-semibold text-slate-900">
                  {item.title || `分析アプローチ${index + 1}`}
                </div>
                {item.selected && (
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-white">
                    採用
                  </span>
                )}
              </div>

              {item.approach && (
                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {item.approach}
                </div>
              )}

              {item.hypothesis && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">仮説:</span>{" "}
                  {item.hypothesis}
                </div>
              )}

              {!!item.axis?.length && (
                <div className="mt-3 text-xs text-slate-500">
                  axis: {item.axis.join(", ")}
                </div>
              )}

              {!!item.items?.length && (
                <div className="mt-1 text-xs text-slate-500">
                  items: {item.items.join(", ")}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderSections = () => {
    const sections = slide.content || [];

    return (
      <div className="space-y-4">
        <div className="text-2xl font-semibold">{slide.title}</div>
        {sections.map((section, index) => (
          <div
            key={`${slide.id}-section-${index}`}
            className="rounded-xl border border-white bg-white/80 px-4 py-4"
          >
            <div className="mb-2 text-sm font-semibold text-slate-900">
              {section.heading}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {section.body || "未生成"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderList = () => {
    const items = slide.content || [];

    return (
      <div className="space-y-4">
        <div className="text-2xl font-semibold">{slide.title}</div>
        {items.length ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={`${slide.id}-item-${index}`}
                className="whitespace-pre-wrap rounded-xl border border-white bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-5 text-sm text-slate-500">
            まだ内容は生成されていません。
          </div>
        )}
      </div>
    );
  };

  const renderText = () => {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">{slide.title}</div>
        <div className="whitespace-pre-wrap rounded-xl border border-white bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700">
          {slide.content || "まだ内容は生成されていません。"}
        </div>
      </div>
    );
  };

  const renderBody = () => {
    if (slide.type === "sections") return renderSections();
    if (slide.type === "list") return renderList();
    if (slide.type === "analysis_list") return renderAnalysisList();
    if (slide.type === "matrix") return renderMatrix();
    return renderText();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="mx-auto flex min-h-[520px] max-w-4xl flex-col rounded-[28px] border border-slate-200 bg-[#f7f5f1] p-8 shadow-inner">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              PPT PREVIEW
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {slide.title}
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
            step output
          </div>
        </div>

        <div className="flex-1">{renderBody()}</div>
      </div>
    </div>
  );
}

function AnalysisPreviewPanel({ projectName, sheets, selectedId, onSelect }) {
  const visibleSheets = sheets.filter((sheet) => sheet.enabled);
  const selectedIndex = Math.max(
    0,
    visibleSheets.findIndex((sheet) => sheet.id === selectedId)
  );
  const selectedSheet = visibleSheets[selectedIndex] || visibleSheets[0];

  const primarySheets = visibleSheets.filter((sheet) => sheet.priority).slice(0, 3);
  const secondarySheets = visibleSheets.filter((sheet) => !sheet.priority);

  const handlePrev = () => {
    if (!visibleSheets.length) return;
    const prev = (selectedIndex - 1 + visibleSheets.length) % visibleSheets.length;
    onSelect(visibleSheets[prev].id);
  };

  const handleNext = () => {
    if (!visibleSheets.length) return;
    const next = (selectedIndex + 1) % visibleSheets.length;
    onSelect(visibleSheets[next].id);
  };

  if (!selectedSheet) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
        分析アプローチがまだ選択されていません。
        5. 分析アプローチ管理で採用するアプローチを選んでください。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">分析アプローチ詳細</div>
          <div className="text-sm text-slate-500">
            分析シート {selectedIndex + 1}/{visibleSheets.length}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-xl border border-slate-300 bg-white p-2 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl border border-slate-300 bg-white p-2 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-semibold">重要3枚</div>

          {primarySheets.map((sheet, idx) => {
            const active = sheet.id === selectedSheet.id;
            return (
              <button
                type="button"
                key={sheet.id}
                onClick={() => onSelect(sheet.id)}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        active ? "bg-white/15" : "bg-slate-100"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {sheet.title}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      active ? "bg-white/15" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    重点
                  </span>
                </div>
                <div className={`text-xs leading-5 ${active ? "text-slate-200" : "text-slate-500"}`}>
                  {truncateText(sheet.objective, 90)}
                </div>
              </button>
            );
          })}

          {secondarySheets.length > 0 && (
            <Collapsible
              title={`他 ${secondarySheets.length} 枚を表示`}
              defaultOpen={false}
              action={
                <span className="rounded-full bg-white px-2 py-1 text-xs">
                  補助分析
                </span>
              }
            >
              <div className="space-y-2">
                {secondarySheets.map((sheet, idx) => {
                  const active = sheet.id === selectedSheet.id;
                  return (
                    <button
                      type="button"
                      key={sheet.id}
                      onClick={() => onSelect(sheet.id)}
                      className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{idx + 4}. {sheet.title}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${
                            active ? "bg-white/15" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {sheet.chartType}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Collapsible>
          )}
        </div>

        <SlidePreviewCard projectName={projectName} sheet={selectedSheet} />
      </div>
    </div>
  );
}

function SlidePreviewCard({ projectName, sheet }) {
  return (
    <div className="flex min-h-[420px] flex-col justify-between rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-fit rounded-xl border border-white bg-white/80 px-4 py-3 text-sm font-medium">
          {projectName}
        </div>
        <div className="flex flex-wrap gap-2">
          {sheet.priority && (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
              重要3枚
            </span>
          )}
          <span className="rounded-full border border-white bg-white/80 px-3 py-1 text-xs text-slate-700">
            {sheet.chartType}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="text-xs text-slate-500">分析アプローチ</div>
          <div className="text-2xl font-semibold">{sheet.title}</div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white bg-white/80 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-900">分析イメージ</div>
            <div className="grid h-[180px] grid-cols-6 gap-2 rounded-xl bg-slate-50 p-3">
              <div className="col-span-4 rounded-lg bg-slate-200" />
              <div className="col-span-2 rounded-lg bg-slate-300" />
              <div className="col-span-2 rounded-lg bg-slate-300" />
              <div className="col-span-2 rounded-lg bg-slate-200" />
              <div className="col-span-2 rounded-lg bg-slate-300" />
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-white bg-white/80 p-4 text-sm leading-6 text-slate-700">
            <div>
              <div className="mb-1 text-xs text-slate-500">このシートの目的</div>
              <div>{sheet.objective}</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-slate-500">比較軸</div>
              <div className="flex flex-wrap gap-2">
                {sheet.axis.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
          <span className="font-semibold text-slate-900">想定示唆:</span> {sheet.insight}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white bg-white/70 px-4 py-3 text-sm">
          <div className="mb-1 text-xs text-slate-500">使用設問</div>
          <div className="space-y-1 text-slate-700">
            {sheet.questions.map((q) => (
              <div key={q}>{q}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white bg-white/70 px-4 py-3 text-sm text-slate-500">
          スライドの簡易プレビュー領域
        </div>
      </div>
    </div>
  );
}

function AnalysisSelectionSection({
  title,
  description,
  items,
  selectedAnalysisIds,
  selectedPreviewId,
  onToggle,
  onPreview,
}) {
  if (!items?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {description ? (
          <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
        ) : null}
      </div>

      <div className="space-y-3">
        {items.map((block) => (
          <AnalysisSelectionCard
            key={block.id}
            block={block}
            isSelected={selectedAnalysisIds.includes(block.id)}
            isPreviewing={selectedPreviewId === block.id}
            onToggle={() => onToggle(block.id)}
            onPreview={() => onPreview(block.id)}
          />
        ))}
      </div>
    </div>
  );
}


function AnalysisSelectionCard({
  block,
  isSelected,
  isPreviewing,
  onToggle,
  onPreview,
}) {
  const priorityLabelMap = {
    recommended: "推奨",
    candidate: "候補",
    excluded: "非推奨",
  };

  return (
    <div
      className={`rounded-2xl border p-3 transition ${
        isPreviewing
          ? "border-slate-900 bg-white shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onPreview}
          className="min-w-0 flex-1 text-left"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-[10px] ${
                block.priority === "recommended"
                  ? "bg-slate-900 text-white"
                  : block.priority === "candidate"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {priorityLabelMap[block.priority] || "候補"}
            </span>
          </div>

          <div className="line-clamp-2 text-sm leading-6 text-slate-900">
            {block.subq || "無題のサブクエスチョン"}
          </div>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${
            isSelected
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isSelected ? "解除" : "採用"}
        </button>
      </div>
    </div>
  );
}


function AnalysisApproachDetailPanel({
  block,
  isSelected,
  onToggleSelected,
  onApplySelection,
  analysisSelectionLoading,
}) {
  if (!block) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
        表示する分析アプローチがありません。
      </div>
    );
  }

  const axisList = normalizeList(block.axis);
  const itemsList = normalizeList(block.items);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold text-slate-900">
              {block.subq || "無題の分析アプローチ"}
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[10px] ${
                block.priority === "recommended"
                  ? "bg-slate-900 text-white"
                  : block.priority === "candidate"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {block.priority === "recommended"
                ? "推奨"
                : block.priority === "candidate"
                ? "候補"
                : "非推奨"}
            </span>

            {typeof block.score === "number" && (
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">
                {block.score}点
              </span>
            )}

            <span
              className={`rounded-full px-2 py-1 text-[10px] ${
                isSelected
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isSelected ? "採用中" : "未採用"}
            </span>
          </div>

          {block.selection_reason ? (
            <div className="mt-2 text-sm leading-6 text-slate-600">
              {block.selection_reason}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleSelected}
            className={`rounded-xl px-3 py-2 text-sm font-medium ${
              isSelected
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isSelected ? "採用解除" : "採用する"}
          </button>

          <button
            type="button"
            onClick={onApplySelection}
            disabled={analysisSelectionLoading}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analysisSelectionLoading ? "反映中..." : "この選択を反映"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReadOnlyTextarea
          label="分析アプローチ"
          value={block.approach || "未設定"}
        />
        <ReadOnlyTextarea
          label="想定仮説"
          value={block.hypothesis || "未設定"}
        />

        <ReadOnlyTextarea
          label="比較軸"
          value={axisList.length ? axisList.join("\n") : "未設定"}
        />
        <ReadOnlyTextarea
          label="使用設問"
          value={itemsList.length ? itemsList.join("\n") : "未設定"}
        />

      </div>
    </div>
  );
}

function ReadOnlyTextarea({ label, value }) {
  return (
    <div className="space-y-2 lg:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="min-h-[92px] whitespace-pre-wrap rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6">
        {value}
      </div>
    </div>
  );
}

function MatchCommentCard({ projectName, selectedAxisLabel, userNote, comment }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
      <div className="mb-2 font-semibold text-slate-900">企画評価コメント</div>
      <div className="mb-3">{comment}</div>
      <div className="grid gap-2 text-xs text-slate-600 md:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-white px-3 py-2">
          案件名: {projectName}
        </div>
        <div className="rounded-xl border border-blue-100 bg-white px-3 py-2">
          主題: {selectedAxisLabel || "未設定"}
        </div>
        <div className="rounded-xl border border-blue-100 bg-white px-3 py-2">
          入力メモ反映: {userNote ? "あり" : "なし"}
        </div>
      </div>
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false, action }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-slate-900">{title}</div>
            <div className="text-sm text-slate-500">
              クリックして{open ? "閉じる" : "開く"}
            </div>
          </div>
          {action}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function getAnalysisBlockId(block) {
  return block?.id || block?.subq || `analysis-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,、]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeOverviewSlides(slides = []) {
  const removedTitles = new Set([
    "ターゲット整理",
    "項目評価",
    "分析軸",
    "検証する仮説",
  ]);

  const normalized = [];
  let hasAnalysisApproach = false;

  slides.forEach((slide) => {
    const rawTitle =
      typeof slide === "string"
        ? slide
        : slide?.title || slide?.name || slide?.label || "";

    const cleanedTitle = String(rawTitle)
      .replace(/^\s*\d+\s*[.．\-ー:]?\s*/u, "")
      .trim();

    if (!cleanedTitle) return;

    if (removedTitles.has(cleanedTitle)) {
      return;
    }

    if (cleanedTitle === "分析アプローチ①" || cleanedTitle === "分析アプローチ②") {
      if (!hasAnalysisApproach) {
        normalized.push("分析アプローチ");
        hasAnalysisApproach = true;
      }
      return;
    }

    if (cleanedTitle === "分析アプローチ") {
      if (!hasAnalysisApproach) {
        normalized.push("分析アプローチ");
        hasAnalysisApproach = true;
      }
      return;
    }

    normalized.push(cleanedTitle);
  });

  return normalized.length
    ? normalized
    : [
        "表紙",
        "調査背景",
        "ビジネス課題",
        "調査目的と問い",
        "分析アプローチ",
        "対象者条件",
        "調査項目案",
      ];
}

function truncateText(text, max = 160) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return "";
  return source.length > max ? `${source.slice(0, max)}…` : source;
}

function getTutorialSelectionLabel(options = [], key = "") {
  return options.find((item) => item.key === key)?.title || "";
}

function buildSelectedAxisTextFromTutorial({ q1Key, q2Key, q3, summary }) {
  const q1Map = {
    market_overview: "市場や顧客の全体像を把握する企画",
    target_strategy: "ターゲットや狙う相手を整理する企画",
    measure_evaluation: "施策や接点の効き方を評価する企画",
  };

  const q2Map = {
    theme_only: "今回テーマに必要な範囲に絞る",
    include_target: "背景となるターゲット整理まで含める",
    include_market: "市場や顧客の前提理解から含める",
  };

  const q3Text = Array.isArray(q3)
    ? q3
        .filter((item) => item?.selected)
        .map((item) => `${item.axis_title}: ${item.scenario}`)
        .join(" / ")
    : "";

  return [
    `主題: ${q1Map[q1Key] || q1Key || "-"}`,
    `企画範囲: ${q2Map[q2Key] || q2Key || "-"}`,
    summary?.contact_evaluation_type
      ? `詳細タイプ: ${summary.contact_evaluation_type}`
      : "",
    q3Text ? `分析提案: ${q3Text}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export default App;