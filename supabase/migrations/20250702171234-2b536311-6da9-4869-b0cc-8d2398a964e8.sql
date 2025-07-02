-- Create user_warnings table for tracking user warnings
CREATE TABLE public.user_warnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  warned_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  warning_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  context TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE public.user_warnings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_warnings
CREATE POLICY "Only admins can view user warnings"
ON public.user_warnings
FOR SELECT
USING (is_current_user_admin());

CREATE POLICY "Only admins can create user warnings"
ON public.user_warnings
FOR INSERT
WITH CHECK (is_current_user_admin());

CREATE POLICY "Only admins can update user warnings"
ON public.user_warnings
FOR UPDATE
USING (is_current_user_admin());

-- Create indexes for performance
CREATE INDEX idx_user_warnings_warned_user_id ON public.user_warnings(warned_user_id);
CREATE INDEX idx_user_warnings_warning_by ON public.user_warnings(warning_by);
CREATE INDEX idx_user_warnings_is_active ON public.user_warnings(is_active);
CREATE INDEX idx_user_warnings_created_at ON public.user_warnings(created_at);

-- Add trigger for user warning notifications (using existing function)
CREATE TRIGGER create_user_warning_notification_trigger
  AFTER INSERT ON public.user_warnings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_warning_notification();