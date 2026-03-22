"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import WebsiteScript from "@/components/web/WebsiteScript";
import { useWebsites } from "@/hooks/useWebsites";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "../ui/spinner";
import { Loader2 } from "lucide-react";

const urlRegex =
  /^(https?:\/\/)(localhost|\b[\w\d-]+(\.[\w\d-]+)+)(:\d+)?\/?$/i;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddWebsite() {
  const { addWebsite } = useWebsites();

  const [formData, setFormData] = useState({
    website: "",
    websiteName: "",
    notifierName: "",
    notifierEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "website":
        if (!value) return "Website URL is required";
        if (!urlRegex.test(value))
          return "Enter a valid URL (https://example.com)";
        break;

      case "websiteName":
        if (!value) return "Website name is required";
        if (value.length < 3)
          return "Website name must be at least 3 characters";
        break;

      case "notifierName":
        if (!value) return "Notifier name is required";
        if (value.length < 3)
          return "Notifier name must be at least 3 characters";
        break;

      case "notifierEmail":
        if (!value) return "Notifier email is required";
        if (!emailRegex.test(value)) return "Enter a valid email";
        break;
    }

    return "";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    for (const key in formData) {
      const err = validateField(key, formData[key]);

      if (err) {
        newErrors[key] = err;
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const result = await addWebsite(formData);

      if (result?.data) {
        setResponseData(result.data);
        toast.success("Website created successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create website");
    } finally {
      setLoading(false);
    }
  };

  const scriptId = responseData?.website?.trackingId;
  const websiteId = responseData?.website?.website_id;

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl lg:ml-10">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="website">Website URL</FieldLabel>

              <FieldContent>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://trakg.com"
                  value={formData.website}
                  onChange={handleChange}
                  aria-invalid={!!errors.website}
                />
              </FieldContent>

              {errors.website && <FieldError>{errors.website}</FieldError>}
            </Field>

            {/* Website Name */}
            <Field>
              <FieldLabel htmlFor="websiteName">Website Name</FieldLabel>

              <FieldContent>
                <Input
                  id="websiteName"
                  name="websiteName"
                  placeholder="Trakg Official Website"
                  value={formData.websiteName}
                  onChange={handleChange}
                  aria-invalid={!!errors.websiteName}
                />
              </FieldContent>

              {errors.websiteName && (
                <FieldError>{errors.websiteName}</FieldError>
              )}
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="notifierName">Notifier Name</FieldLabel>

                <FieldContent>
                  <Input
                    id="notifierName"
                    name="notifierName"
                    placeholder="Arpit Sharma"
                    value={formData.notifierName}
                    onChange={handleChange}
                    aria-invalid={!!errors.notifierName}
                  />
                </FieldContent>

                <FieldDescription>Person who receives alerts.</FieldDescription>

                {errors.notifierName && (
                  <FieldError>{errors.notifierName}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="notifierEmail">Notifier Email</FieldLabel>

                <FieldContent>
                  <Input
                    id="notifierEmail"
                    name="notifierEmail"
                    placeholder="your@email.com"
                    value={formData.notifierEmail}
                    onChange={handleChange}
                    aria-invalid={!!errors.notifierEmail}
                  />
                </FieldContent>

                <FieldDescription>
                  Downtime alerts will be sent here.
                </FieldDescription>

                {errors.notifierEmail && (
                  <FieldError>{errors.notifierEmail}</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 min-w-[180px] relative"
          >
            {loading ? (
              <Loader2 className="animate-spinner-ease-spin duration-900" />
            ) : (
              "Create Website"
            )}
          </Button>
        </FieldSet>
      </form>

      <WebsiteScript
        success={!!responseData}
        website_id={websiteId}
        script={scriptId}
        websiteName={formData.websiteName}
      />
    </>
  );
}
