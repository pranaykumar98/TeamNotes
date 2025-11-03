const Note = require("../models/note.model");
const mongoose = require("mongoose");

//Analytics API
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const totalNotesPromise = Note.countDocuments({ createdBy: userId });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    const notesPerDayPromise = Note.aggregate([
      {
        $match: {
          createdBy: userId,
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topTagsPromise = Note.aggregate([
      { $match: { createdBy: userId } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const [totalNotes, notesPerDay, topTags] = await Promise.all([
      totalNotesPromise,
      notesPerDayPromise,
      topTagsPromise,
    ]);

    const resultDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(last7Days);
      date.setDate(last7Days.getDate() + i);
      const formatted = date.toISOString().split("T")[0];

      const dayData = notesPerDay.find((n) => n._id === formatted);
      resultDays.push({
        date: formatted,
        count: dayData ? dayData.count : 0,
      });
    }

    const formattedTags = topTags.map((t) => ({
      tag: t._id,
      count: t.count,
    }));

    res.status(200).json({
      totalNotes,
      notesLast7Days: resultDays,
      topTags: formattedTags,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
