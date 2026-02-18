import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  Trophy,
  ChevronDown,
  Search,
  Users,
  Eye,
  RefreshCw,
  Loader2,
  BarChart3,
  List,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import awardService from "../../../../services/awardService";

/* ─── Chart helpers ─── */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
        <p className="font-bold text-gray-900 leading-none mb-1">{label}</p>
        <p className="text-orange-500 font-black">
          {payload[0].value.toLocaleString()} votes
        </p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    }),
  ),
  label: PropTypes.string,
};

const RenderCustomBar = (props) => {
  const { fill, x, y, width, height, index, payload } = props;
  const radius = 8;
  const imgSize = 40;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
      />
      {payload.nominee_image && height > imgSize + 8 && (
        <>
          <defs>
            <clipPath id={`admin-clip-${index}`}>
              <circle cx={x + width / 2} cy={y + height / 2} r={imgSize / 2} />
            </clipPath>
          </defs>
          <circle
            cx={x + width / 2}
            cy={y + height / 2}
            r={imgSize / 2 + 2}
            fill="white"
          />
          <image
            x={x + width / 2 - imgSize / 2}
            y={y + height / 2 - imgSize / 2}
            width={imgSize}
            height={imgSize}
            xlinkHref={payload.nominee_image}
            clipPath={`url(#admin-clip-${index})`}
            preserveAspectRatio="xMidYMid slice"
          />
          <circle
            cx={x + width / 2}
            cy={y + height / 2}
            r={imgSize / 2}
            fill="none"
            stroke="white"
            strokeWidth={2}
          />
        </>
      )}
    </g>
  );
};

RenderCustomBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  payload: PropTypes.shape({
    nominee_image: PropTypes.string,
  }),
};

/* ─── Export helpers (zero external dependencies) ─── */

const buildPrintStyles = () => `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; padding: 24px; }
  .title { text-align: center; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .subtitle { text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #1f2937; color: #fff; padding: 8px 12px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  th.right { text-align: right; }
  th.center { text-align: center; }
  td { padding: 7px 12px; border-bottom: 1px solid #e5e7eb; }
  td.right { text-align: right; }
  td.center { text-align: center; }
  tr:nth-child(even) { background: #f9fafb; }
  .cat-header td { background: #f97316; color: #fff; font-weight: 700; font-size: 13px; padding: 10px 12px; }
  @media print {
    body { padding: 0; }
    @page { margin: 15mm; }
  }
`;

const buildNomineeRows = (category) => {
  const totalVotes = category.nominees.reduce(
    (sum, n) => sum + (n.total_votes || 0),
    0,
  );

  return category.nominees
    .map((n) => {
      const share =
        totalVotes > 0
          ? (((n.total_votes || 0) / totalVotes) * 100).toFixed(1) + "%"
          : "0.0%";
      return `<tr>
        <td class="center">${n.rank}</td>
        <td>${n.nominee_name || "-"}</td>
        <td>${n.nominee_code || "-"}</td>
        <td class="right">${(n.total_votes || 0).toLocaleString()}</td>
        <td class="right">${share}</td>
      </tr>`;
    })
    .join("");
};

const TABLE_HEAD = `<thead><tr>
  <th class="center" style="width:50px">Rank</th>
  <th>Nominee Name</th>
  <th>Code</th>
  <th class="right">Votes</th>
  <th class="right" style="width:70px">Share</th>
</tr></thead>`;

const openPrintWindow = (html) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

const exportAllResultsPDF = (filteredLeaderboard, awardTitle) => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let tableRows = "";
  filteredLeaderboard.forEach((category) => {
    const totalVotes = category.nominees.reduce(
      (sum, n) => sum + (n.total_votes || 0),
      0,
    );
    tableRows += `<tr class="cat-header"><td colspan="5">${category.category_name}  —  ${category.nominees.length} Nominees  •  ${totalVotes.toLocaleString()} Votes</td></tr>`;
    tableRows += buildNomineeRows(category);
  });

  openPrintWindow(`<!DOCTYPE html><html><head><title>${awardTitle || "Award Results"}</title><style>${buildPrintStyles()}</style></head><body>
    <div class="title">${awardTitle || "Award Results"}</div>
    <div class="subtitle">Exported on ${date}</div>
    <table>${TABLE_HEAD}<tbody>${tableRows}</tbody></table>
  </body></html>`);
};

const exportCategoryPDF = (category, awardTitle) => {
  const totalVotes = category.nominees.reduce(
    (sum, n) => sum + (n.total_votes || 0),
    0,
  );

  openPrintWindow(`<!DOCTYPE html><html><head><title>${category.category_name} Results</title><style>${buildPrintStyles()}</style></head><body>
    <div class="title">${category.category_name}</div>
    <div class="subtitle">${awardTitle || "Award Results"} — ${category.nominees.length} Nominees • ${totalVotes.toLocaleString()} Total Votes</div>
    <table>${TABLE_HEAD}<tbody>${buildNomineeRows(category)}</tbody></table>
  </body></html>`);
};

const exportCategoryImage = (categoryRef, categoryName) => {
  if (!categoryRef) return;

  const fileName = `${(categoryName || "category").replace(/[^a-zA-Z0-9]/g, "_")}_results.png`;

  // Check if we're in chart view (SVG from Recharts) or table view
  const svgEl = categoryRef.querySelector("svg.recharts-surface");

  if (svgEl) {
    // ── Chart view: serialize SVG to canvas ──
    const svgClone = svgEl.cloneNode(true);
    const bbox = svgEl.getBoundingClientRect();
    const scale = 2;

    // Ensure the clone has explicit dimensions and a white background
    svgClone.setAttribute("width", bbox.width);
    svgClone.setAttribute("height", bbox.height);
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgClone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    // Add white background rect as first child
    const bgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "#ffffff");
    svgClone.insertBefore(bgRect, svgClone.firstChild);

    // Copy computed styles for text elements
    const origTexts = svgEl.querySelectorAll("text");
    const cloneTexts = svgClone.querySelectorAll("text");
    origTexts.forEach((orig, i) => {
      if (cloneTexts[i]) {
        const computed = window.getComputedStyle(orig);
        cloneTexts[i].style.fontFamily = computed.fontFamily || "sans-serif";
        cloneTexts[i].style.fontSize = computed.fontSize || "12px";
        cloneTexts[i].style.fontWeight = computed.fontWeight || "400";
      }
    });

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = bbox.width * scale;
      canvas.height = bbox.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, bbox.width, bbox.height);
      ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      console.error("Failed to render chart as image");
    };
    img.src = url;
    return;
  }

  // ── Table view: draw rows onto canvas ──
  const rows = categoryRef.querySelectorAll("table tr");
  if (!rows || rows.length === 0) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = 2;
  const rowHeight = 36;
  const headerHeight = 40;
  const padding = 24;
  const colWidths = [60, 240, 100, 80, 70];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const totalWidth = tableWidth + padding * 2;
  const totalHeight = headerHeight + rows.length * rowHeight + padding * 2;

  canvas.width = totalWidth * scale;
  canvas.height = totalHeight * scale;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  let y = padding;
  rows.forEach((row, rowIdx) => {
    const cells = row.querySelectorAll("th, td");
    const isHeader = row.querySelector("th") !== null;
    const h = isHeader ? headerHeight : rowHeight;

    if (isHeader) {
      ctx.fillStyle = "#1f2937";
    } else if (rowIdx % 2 === 0) {
      ctx.fillStyle = "#f9fafb";
    } else {
      ctx.fillStyle = "#ffffff";
    }
    ctx.fillRect(padding, y, tableWidth, h);

    let x = padding;
    cells.forEach((cell, cellIdx) => {
      const colW = colWidths[cellIdx] || 100;
      ctx.fillStyle = isHeader ? "#ffffff" : "#111827";
      ctx.font = isHeader ? "bold 11px sans-serif" : "12px sans-serif";
      const text = cell.textContent.trim();
      const textX = cellIdx >= 3 ? x + colW - 8 : x + 8;
      ctx.textAlign = cellIdx >= 3 ? "right" : "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, textX, y + h / 2, colW - 16);
      x += colW;
    });

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(padding, y + h);
    ctx.lineTo(padding + tableWidth, y + h);
    ctx.stroke();
    y += h;
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

/* ─── Main Component ─── */

/**
 * AwardResults - Leaderboard/Results tab for Admin and Organizer Award Detail pages
 * Shows voting results grouped by category with nominees ranked by vote count
 */
const AwardResults = ({ award }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [viewMode, setViewMode] = useState("table");
  const [exportingAll, setExportingAll] = useState(false);
  const [exportingCategory, setExportingCategory] = useState(null);
  const [openExportMenu, setOpenExportMenu] = useState(null);
  const categoryRefs = useRef({});

  const setCategoryRef = useCallback((categoryId, el) => {
    if (el) {
      categoryRefs.current[categoryId] = el;
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (!award?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await awardService.getLeaderboard(award.id);
      const data = response?.data || response;
      const leaderboardData = data.leaderboard || [];
      setLeaderboard(leaderboardData);

      // Auto-expand the first category
      if (leaderboardData.length > 0) {
        setExpandedCategories({ [leaderboardData[0].category_id]: true });
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load results data.");
    } finally {
      setIsLoading(false);
    }
  }, [award?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenExportMenu(null);
    if (openExportMenu !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openExportMenu]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard
      .filter(
        (cat) =>
          selectedCategory === "all" ||
          String(cat.category_id) === String(selectedCategory),
      )
      .map((cat) => {
        const allNomineesSorted = (cat.nominees || [])
          .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
          .map((n, idx) => ({ ...n, rank: idx + 1 }));

        const filteredNominees = allNomineesSorted.filter(
          (n) =>
            n.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.nominee_code &&
              n.nominee_code.toLowerCase().includes(searchTerm.toLowerCase())),
        );

        return { ...cat, nominees: filteredNominees };
      })
      .filter((cat) => cat.nominees.length > 0);
  }, [leaderboard, selectedCategory, searchTerm]);

  const handleExportAll = () => {
    setExportingAll(true);
    try {
      exportAllResultsPDF(filteredLeaderboard, award?.title);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingAll(false);
    }
  };

  const handleExportCategoryPDF = (category) => {
    setExportingCategory(category.category_id);
    setOpenExportMenu(null);
    try {
      exportCategoryPDF(category, award?.title);
    } catch (err) {
      console.error("Category PDF export failed:", err);
    } finally {
      setExportingCategory(null);
    }
  };

  const handleExportCategoryImage = (category) => {
    setExportingCategory(category.category_id);
    setOpenExportMenu(null);
    try {
      const ref = categoryRefs.current[category.category_id];
      exportCategoryImage(ref, category.category_name);
    } catch (err) {
      console.error("Category image export failed:", err);
    } finally {
      setExportingCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-orange-500" />
        <span className="ml-3 text-gray-500">Loading results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 mb-3">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!award?.show_results) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye size={28} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Results Visibility Off
        </h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Results are currently hidden from the public. You can still view them
          here. Toggle this in Settings to make results visible to voters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {leaderboard.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search nominees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`p-2 rounded-lg transition-all ${viewMode === "chart" ? "bg-white shadow-sm text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
              title="Chart view"
            >
              <BarChart3 size={16} />
            </button>
          </div>

          {/* Export All Button */}
          <button
            onClick={handleExportAll}
            disabled={exportingAll || filteredLeaderboard.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Export All
          </button>

          <button
            onClick={fetchLeaderboard}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Results */}
      {filteredLeaderboard.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users size={40} className="mx-auto text-gray-200 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Results Yet
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm
              ? "No nominees match your search."
              : "No votes have been cast yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeaderboard.map((category) => {
            const isExpanded = expandedCategories[category.category_id];
            const categoryTotalVotes = category.nominees.reduce(
              (sum, n) => sum + (n.total_votes || 0),
              0,
            );
            const isExporting = exportingCategory === category.category_id;

            return (
              <div
                key={category.category_id}
                ref={(el) => setCategoryRef(category.category_id, el)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => toggleCategory(category.category_id)}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isExpanded
                          ? "bg-orange-50 text-orange-600"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {category.category_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category.nominees.length} Nominees •{" "}
                        {categoryTotalVotes.toLocaleString()} Votes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Per-category export dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenExportMenu(
                            openExportMenu === category.category_id
                              ? null
                              : category.category_id,
                          );
                        }}
                        disabled={isExporting}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Export category"
                      >
                        {isExporting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>

                      {openExportMenu === category.category_id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-44 py-1 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleExportCategoryPDF(category)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FileText size={15} className="text-red-500" />
                            Export as PDF
                          </button>
                          <button
                            onClick={() => handleExportCategoryImage(category)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ImageIcon size={15} className="text-blue-500" />
                            Export as Image
                          </button>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-1.5 rounded-lg transition-transform cursor-pointer ${
                        isExpanded
                          ? "rotate-180 text-orange-600"
                          : "text-gray-400"
                      }`}
                      onClick={() => toggleCategory(category.category_id)}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {viewMode === "table" ? (
                      /* Table View */
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-14">
                                Rank
                              </th>
                              <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Nominee
                              </th>
                              <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Code
                              </th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24">
                                Votes
                              </th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20">
                                Share
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {category.nominees.map((nominee, index) => {
                              const voteShare =
                                categoryTotalVotes > 0
                                  ? (
                                      ((nominee.total_votes || 0) /
                                        categoryTotalVotes) *
                                      100
                                    ).toFixed(1)
                                  : "0.0";

                              return (
                                <tr
                                  key={nominee.nominee_id}
                                  className={`group hover:bg-gray-50/50 transition-colors ${
                                    index === 0 ? "bg-orange-50/30" : ""
                                  }`}
                                >
                                  <td className="px-4 py-3">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                        nominee.rank === 1
                                          ? "bg-yellow-100 text-yellow-700"
                                          : nominee.rank === 2
                                            ? "bg-gray-100 text-gray-600"
                                            : nominee.rank === 3
                                              ? "bg-orange-50 text-orange-600"
                                              : "text-gray-400"
                                      }`}
                                    >
                                      {nominee.rank}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                      {nominee.nominee_image ? (
                                        <img
                                          src={nominee.nominee_image}
                                          alt={nominee.nominee_name}
                                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                          {nominee.nominee_name?.charAt(0)}
                                        </div>
                                      )}
                                      <span className="font-semibold text-sm text-gray-900 truncate max-w-[180px]">
                                        {nominee.nominee_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                                    {nominee.nominee_code || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex flex-col items-end">
                                      <span className="font-bold text-sm text-gray-900">
                                        {(
                                          nominee.total_votes || 0
                                        ).toLocaleString()}
                                      </span>
                                      <div className="w-16 h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden">
                                        <div
                                          className="h-full bg-orange-500 rounded-full transition-all"
                                          style={{
                                            width: `${(nominee.total_votes / (categoryTotalVotes || 1)) * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <span className="text-xs font-semibold text-gray-500">
                                      {voteShare}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Chart View */
                      <div className="p-6 pb-10">
                        <div className="h-[380px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={category.nominees.slice(0, 10)}
                              margin={{
                                top: 30,
                                right: 30,
                                left: 0,
                                bottom: 40,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5e7eb"
                              />
                              <XAxis
                                dataKey="nominee_name"
                                angle={-20}
                                textAnchor="end"
                                interval={0}
                                tick={{
                                  fill: "#9ca3af",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                                axisLine={{ stroke: "#e5e7eb" }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#d1d5db", fontSize: 10 }}
                              />
                              <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "#f3f4f6", radius: 10 }}
                              />
                              <Bar
                                dataKey="total_votes"
                                shape={<RenderCustomBar />}
                                barSize={40}
                              >
                                {category.nominees
                                  .slice(0, 10)
                                  .map((entry, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={idx === 0 ? "#fbbf24" : "#f97316"}
                                    />
                                  ))}
                                <LabelList
                                  dataKey="total_votes"
                                  position="top"
                                  formatter={(val) => val.toLocaleString()}
                                  style={{
                                    fill: "#4b5563",
                                    fontSize: 11,
                                    fontWeight: 800,
                                  }}
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

AwardResults.propTypes = {
  award: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    show_results: PropTypes.bool,
  }),
};

export default AwardResults;
