import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import type { CreateTicketRequest } from '../../types';

interface FormErrors {
  title?: string;
  description?: string;
}

interface EnhancedTicketFormProps {
  initialValues?: Partial<CreateTicketRequest>;
  onSubmit: (data: CreateTicketRequest) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  children?: React.ReactNode;
}

export function EnhancedTicketForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
  children,
}: EnhancedTicketFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ title: false, description: false });

  // Update form when initial values change
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
    }
  }, [initialValues]);

  // Real-time validation
  const validateTitle = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Title is required';
    }
    if (value.trim().length < 3) {
      return 'Title must be at least 3 characters';
    }
    if (value.length > 200) {
      return 'Title must not exceed 200 characters';
    }
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (value && value.length > 2000) {
      return 'Description must not exceed 2000 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: validateTitle(title),
      description: validateDescription(description),
    };

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    
    if (touched.title) {
      setErrors((prev) => ({
        ...prev,
        title: validateTitle(value),
      }));
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    
    if (touched.description) {
      setErrors((prev) => ({
        ...prev,
        description: validateDescription(value),
      }));
    }
  };

  const handleTitleBlur = () => {
    setTouched((prev) => ({ ...prev, title: true }));
    setErrors((prev) => ({
      ...prev,
      title: validateTitle(title),
    }));
  };

  const handleDescriptionBlur = () => {
    setTouched((prev) => ({ ...prev, description: true }));
    setErrors((prev) => ({
      ...prev,
      description: validateDescription(description),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ title: true, description: true });
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  const isFormValid = !errors.title && !errors.description && title.trim().length >= 3;
  const titleLength = title.length;
  const descriptionLength = description.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Field */}
      <div>
        <Label htmlFor="title" className="text-sm font-medium text-gray-900">
          Title <span className="text-red-500">*</span>
        </Label>
        <div className="mt-1.5 relative">
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            placeholder="e.g., Fix login page bug"
            maxLength={200}
            required
            autoFocus
            disabled={isSubmitting}
            className={`${
              errors.title && touched.title
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : title.trim() && !errors.title
                ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
                : ''
            }`}
          />
          {title.trim() && !errors.title && touched.title && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </div>
        
        {/* Character count and error */}
        <div className="mt-1.5 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {errors.title && touched.title ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500"
              >
                Minimum 3 characters required
              </motion.p>
            )}
          </AnimatePresence>
          <p
            className={`text-xs ${
              titleLength > 180
                ? 'text-orange-600 font-medium'
                : titleLength > 0
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            {titleLength}/200
          </p>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-900">
          Description
          <span className="ml-2 text-xs font-normal text-gray-500">(optional)</span>
        </Label>
        <div className="mt-1.5">
          <Textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            placeholder="Provide additional details about the ticket..."
            rows={5}
            className={`resize-none ${
              errors.description && touched.description
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : ''
            }`}
            disabled={isSubmitting}
          />
        </div>
        
        {/* Character count and error */}
        <div className="mt-1.5 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {errors.description && touched.description ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </motion.p>
            ) : (
              <div key="hint" className="text-xs text-gray-500">
                Markdown supported
              </div>
            )}
          </AnimatePresence>
          <p
            className={`text-xs ${
              descriptionLength > 1800
                ? 'text-orange-600 font-medium'
                : descriptionLength > 0
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            {descriptionLength}/2000
          </p>
        </div>
      </div>

      {/* Additional Content (e.g., Tags) */}
      {children && (
        <div className="pt-6 border-t border-gray-200">
          {children}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-6 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
