import React from "react";
import PropTypes from "prop-types";
import {
  Plus,
  Trophy,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Users,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Button } from "../../../ui/button";

const AwardCategories = ({
  award,
  expandedCategories,
  toggleCategory,
  openCategoryModal,
  handleToggleCategoryVoting,
  togglingCategoryId,
  formatCurrency,
  handleDeleteCategory,
  openNomineeModal,
  handleDeleteNominee,
  handleCategoryDragStart,
  handleCategoryDragOver,
  handleCategoryDrop,
  handleNomineeDragStart,
  handleNomineeDragOver,
  handleNomineeDrop,
  draggedCategory,
  draggedNominee,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Categories & Nominees
        </h3>
        <div className="flex items-center gap-2">
          {award?.categories?.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => {
                const categories = award.categories || [];
                let tableRows = "";
                categories
                  .sort(
                    (a, b) => (a.display_order || 0) - (b.display_order || 0),
                  )
                  .forEach((cat) => {
                    const catVotes =
                      cat.total_votes ??
                      (cat.nominees || []).reduce(
                        (sum, n) => sum + (n.total_votes || 0),
                        0,
                      );
                    const catRevenue = cat.revenue ?? 0;
                    tableRows += `<tr class="cat-header"><td colspan="5">${cat.name}  —  ${(cat.nominees || []).length} Nominees  •  ${catVotes.toLocaleString()} Votes • ${formatCurrency(catRevenue)} Rev</td></tr>`;
                    if (cat.nominees && cat.nominees.length > 0) {
                      [...cat.nominees]
                        .sort(
                          (a, b) => (b.total_votes || 0) - (a.total_votes || 0),
                        )
                        .forEach((n) => {
                          const revenue =
                            n.revenue ||
                            (n.total_votes || 0) * (cat.cost_per_vote || 0);
                          tableRows += `<tr>
                            <td>${n.name || "-"}</td>
                            <td>${n.nominee_code || "-"}</td>
                            <td class="right">${(n.total_votes || 0).toLocaleString()}</td>
                            <td class="right">${formatCurrency(revenue)}</td>
                            <td class="right">${catVotes > 0 ? (((n.total_votes || 0) / catVotes) * 100).toFixed(1) + "%" : "0.0%"}</td>
                          </tr>`;
                        });
                    } else {
                      tableRows += `<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:16px;">No nominees</td></tr>`;
                    }
                  });

                const html = `<!DOCTYPE html><html><head><title>${award.title || "Award"} - Nominees</title><style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; padding: 24px; }
                  .title { text-align: center; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
                  .subtitle { text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 20px; }
                  table { width: 100%; border-collapse: collapse; font-size: 12px; }
                  th { background: #1f2937; color: #fff; padding: 8px 12px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                  th.right { text-align: right; }
                  td { padding: 7px 12px; border-bottom: 1px solid #e5e7eb; }
                  td.right { text-align: right; }
                  tr:nth-child(even) { background: #f9fafb; }
                  .cat-header td { background: #f97316; color: #fff; font-weight: 700; font-size: 13px; padding: 10px 12px; }
                  @media print { body { padding: 0; } @page { margin: 15mm; } }
                </style></head><body>
                  <div class="title">${award.title || "Award"} — Nominees</div>
                  <div class="subtitle">Exported on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  <table>
                    <thead><tr>
                      <th>Nominee Name</th>
                      <th>Code</th>
                      <th class="right">Votes</th>
                      <th class="right">Revenue</th>
                      <th class="right" style="width:70px">Share</th>
                    </tr></thead>
                    <tbody>${tableRows}</tbody>
                  </table>
                </body></html>`;

                const printWindow = window.open("", "_blank");
                if (!printWindow) return;
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.onload = () => {
                  printWindow.focus();
                  printWindow.print();
                };
              }}
            >
              <Download size={16} />
              Export Nominees
            </Button>
          )}
          <Button onClick={() => openCategoryModal()} className="gap-2">
            <Plus size={16} />
            Add Category
          </Button>
        </div>
      </div>

      {award?.categories?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {[...award.categories]
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((category) => {
              const categoryTotalVotes =
                category.total_votes ??
                (category.nominees?.reduce(
                  (sum, n) => sum + (n.total_votes || 0),
                  0,
                ) ||
                  0);

              const categoryRevenue = category.revenue || 0;
              const categoryAdmin = category.admin_earnings || 0;
              const categoryOrganizer = category.organizer_earnings || 0;

              return (
                <Card
                  key={category.id}
                  draggable
                  onDragStart={(e) => handleCategoryDragStart(e, category)}
                  onDragOver={handleCategoryDragOver}
                  onDrop={(e) => handleCategoryDrop(e, category)}
                  className={`transition-all overflow-hidden ${
                    draggedCategory?.id === category.id ? "opacity-50" : ""
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between py-4 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {expandedCategories[category.id] ? (
                          <ChevronDown size={20} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-500" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {category.name}
                        </h4>
                        {category.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div
                          className="flex items-center gap-2 mr-2 bg-white px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                          onClick={(e) =>
                            handleToggleCategoryVoting(
                              e,
                              category.id,
                              (category.internal_voting_status ||
                                category.voting_status) === "open"
                                ? "closed"
                                : "open",
                            )
                          }
                        >
                          {String(togglingCategoryId) ===
                          String(category.id) ? (
                            <Loader2
                              size={14}
                              className="animate-spin text-orange-600"
                            />
                          ) : (category.internal_voting_status ||
                              category.voting_status) === "open" ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <XCircle size={14} className="text-red-600" />
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tight ${
                              category.voting_status === "open"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            Category Voting:{" "}
                            {category.voting_status === "open"
                              ? "OPEN"
                              : "CLOSED"}
                            {award?.voting_status !== "open" &&
                              (category.internal_voting_status ||
                                category.voting_status) === "open" && (
                                <span className="ml-1 opacity-60">
                                  (Suppressed by Award)
                                </span>
                              )}
                            {award?.voting_status !== "open" &&
                              (category.internal_voting_status ||
                                category.voting_status) === "closed" && (
                                <span className="ml-1 opacity-60 text-red-400">
                                  (Award Closed)
                                </span>
                              )}
                          </span>
                        </div>

                        <div className="text-right hidden md:block border-r pr-4 border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {categoryTotalVotes.toLocaleString()} votes
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {formatCurrency(category.cost_per_vote)}/vote
                          </p>
                        </div>
                        <div className="text-right hidden lg:block">
                          <p className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(categoryRevenue)}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Org:{" "}
                            <span className="text-blue-600 font-medium">
                              {formatCurrency(categoryOrganizer)}
                            </span>{" "}
                            | Admin:{" "}
                            <span className="text-red-500 font-medium">
                              {formatCurrency(categoryAdmin)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4 border-l pl-4 border-gray-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => openNomineeModal(e, category.id)}
                          title="Add Nominee"
                        >
                          <Plus size={16} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCategoryModal(category);
                          }}
                          title="Edit Category"
                        >
                          <Edit size={16} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => handleDeleteCategory(e, category.id)}
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedCategories[category.id] && (
                    <CardContent className="p-0 border-t border-gray-100">
                      {category.nominees && category.nominees.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-gray-400 font-bold uppercase bg-gray-50/50">
                              <tr>
                                <th className="px-2 sm:px-4 py-3 font-semibold">
                                  Nominee
                                </th>
                                <th className="hidden lg:table-cell px-4 py-3 font-semibold">
                                  Code
                                </th>
                                <th className="px-2 sm:px-4 py-3 font-semibold text-right">
                                  Votes
                                </th>
                                <th className="hidden sm:table-cell px-2 sm:px-4 py-3 font-semibold text-right whitespace-nowrap">
                                  % Share
                                </th>
                                <th className="px-2 sm:px-4 py-3 font-semibold text-center">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {[...category.nominees]
                                .sort(
                                  (a, b) =>
                                    (b.total_votes || 0) - (a.total_votes || 0),
                                )
                                .map((nominee) => {
                                  const votePercentage =
                                    categoryTotalVotes > 0
                                      ? ((nominee.total_votes || 0) /
                                          categoryTotalVotes) *
                                        100
                                      : 0;

                                  return (
                                    <tr
                                      key={nominee.id}
                                      draggable
                                      onDragStart={(e) =>
                                        handleNomineeDragStart(e, nominee)
                                      }
                                      onDragOver={handleNomineeDragOver}
                                      onDrop={(e) =>
                                        handleNomineeDrop(
                                          e,
                                          nominee,
                                          category.id,
                                        )
                                      }
                                      className={`hover:bg-gray-50/50 transition-colors group cursor-move ${
                                        draggedNominee?.id === nominee.id
                                          ? "opacity-50"
                                          : ""
                                      }`}
                                    >
                                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                            {nominee.image ? (
                                              <img
                                                src={nominee.image}
                                                alt={nominee.name}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Users size={14} />
                                              </div>
                                            )}
                                          </div>
                                          <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate text-xs sm:text-sm">
                                              {nominee.name}
                                            </p>
                                            <p className="lg:hidden text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tight">
                                              {nominee.nominee_code}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="hidden lg:table-cell px-4 py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tight">
                                        {nominee.nominee_code}
                                      </td>
                                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-green-600 text-xs sm:text-sm">
                                        {(
                                          nominee.total_votes || 0
                                        ).toLocaleString()}
                                      </td>
                                      <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded leading-none">
                                            {votePercentage.toFixed(1)}%
                                          </span>
                                          <div className="w-12 sm:w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                              style={{
                                                width: `${votePercentage}%`,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                                        <div className="flex items-center justify-center gap-0.5 sm:gap-1 opacity-100 transition-opacity">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openNomineeModal(
                                                e,
                                                category.id,
                                                nominee,
                                              );
                                            }}
                                          >
                                            <Edit size={14} />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteNominee(
                                                e,
                                                nominee.id,
                                              );
                                            }}
                                          >
                                            <Trash2 size={14} />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50/20">
                          <Users
                            size={40}
                            className="mx-auto text-gray-200 mb-2"
                          />
                          <p className="text-sm text-gray-400 mb-4 font-medium">
                            This category has no nominees yet
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => openNomineeModal(e, category.id)}
                            className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50 shadow-sm"
                          >
                            <Plus size={14} className="mr-2" />
                            Add Nominee
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Trophy size={40} className="text-orange-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              No Categories Found
            </h4>
            <p className="text-gray-500 max-w-sm mb-8 text-center text-sm">
              Categories allow you to group nominees. You must have at least one
              category to add nominees.
            </p>
            <Button
              className="gap-2 bg-orange-600 hover:bg-orange-700 h-11 px-8 shadow-lg shadow-orange-100"
              onClick={() => openCategoryModal()}
            >
              <Plus size={18} />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

AwardCategories.propTypes = {
  award: PropTypes.object,
  expandedCategories: PropTypes.object.isRequired,
  toggleCategory: PropTypes.func.isRequired,
  openCategoryModal: PropTypes.func.isRequired,
  handleToggleCategoryVoting: PropTypes.func.isRequired,
  togglingCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formatCurrency: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
  openNomineeModal: PropTypes.func.isRequired,
  handleDeleteNominee: PropTypes.func.isRequired,
  handleCategoryDragStart: PropTypes.func.isRequired,
  handleCategoryDragOver: PropTypes.func.isRequired,
  handleCategoryDrop: PropTypes.func.isRequired,
  handleNomineeDragStart: PropTypes.func.isRequired,
  handleNomineeDragOver: PropTypes.func.isRequired,
  handleNomineeDrop: PropTypes.func.isRequired,
  draggedCategory: PropTypes.object,
  draggedNominee: PropTypes.object,
};

export default AwardCategories;
