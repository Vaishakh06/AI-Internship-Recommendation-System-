// export const parseDataFromBackend = async (callback, type) => {
//   const response = await callback();

//   if (!response) return;

//   let recommendations = response;

//   // If response is a string (with ```json or just JSON), clean & parse it
//   if (typeof response === "string") {
//     // Remove any backticks or code fences
//     const cleaned = response.replace(/```(json)?/g, "").trim();
//     try {
//       recommendations = JSON.parse(cleaned);
//     } catch (err) {
//       console.error("Failed to parse AI response:", err);
//       return;
//     }
//   }

//   if (type === "recommended") {
//     return (
//       recommendations.find((r) => r.type === "recommended")?.internships || []
//     );
//   } else if (type === "allRelated") {
//     return (
//       recommendations.find((r) => r.type === "allRelated")?.internships || []
//     );
//   } else {
//     throw new Error("This type is not available");
//   }

//   //   console.log("Recommended internships:", recommended);
//   //   console.log("All related internships:", allRelated);
// };


export const parseDataFromBackend = async (callback) => {
  const response = await callback();

  if (!response) return { recommended: [], allRelated: [] };

  let recommendations = response;

  // Handle string response (strip ```json fences)
  if (typeof response === "string") {
    const cleaned = response.replace(/```(json)?/g, "").trim();
    try {
      recommendations = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      return { recommended: [], allRelated: [] };
    }
  }

  return {
    recommended:
      recommendations.find((r) => r.type === "recommended")?.internships || [],
    allRelated:
      recommendations.find((r) => r.type === "allRelated")?.internships || [],
  };
};
