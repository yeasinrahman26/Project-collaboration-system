"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/utils/api";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { MessageCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function Comments({ taskId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { text: "" },
  });

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/comments/${taskId}/comments?page=1&limit=100`,
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.post(`/comments/${taskId}/comments`, { text: data.text });
      toast.success("Comment added!");
      reset();
      fetchComments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        toast.success("Comment deleted!");
        fetchComments();
      } catch (error) {
        toast.error("Failed to delete comment");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={20} className="text-primary" />
        <h3 className="font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          placeholder="Add a comment..."
          rows="3"
          className="input-field resize-none"
          {...register("text", {
            required: "Comment cannot be empty",
            maxLength: {
              value: 1000,
              message: "Comment must be less than 1000 characters",
            },
          })}
        />
        {errors.text && <p className="error-message">{errors.text.message}</p>}
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          className="w-full"
        >
          Post Comment
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {comment.userId?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </p>
                </div>
                {user?.id === comment.userId?._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="p-1 text-error hover:bg-red-100 dark:hover:bg-red-900 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Comment Text */}
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}