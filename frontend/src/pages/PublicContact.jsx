import { useForm } from "react-hook-form";
import { Mail, Phone, User, Building2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import leadService from "../services/leadService";
import { useEffect, useState } from "react";
import api from "../services/api";

function PublicContact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await leadService.createPublicLead({
        ...data,
        source: "Website",
      });
      console.log(data)

      toast.success("Thanks! We'll contact you soon.");

      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit form"
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800";

  const [companies, setCompanies] =
    useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get(
          "/auth/companies"
        );

        setCompanies(
          response.data.companies || []
        );
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to load companies"
        );
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Let's Work Together
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Tell us about your project and we'll get
            back to you shortly.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Who do you want to contact?
              </label>

              <select
                {...register("companyId", {
                  required: "Please select a company",
                })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">
                  Select a company
                </option>

                {companies.map((company) => (
                  <option
                    key={company._id}
                    value={company._id}
                  >
                    {company.companyName}
                  </option>
                ))}
              </select>

              {errors.companyId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyId.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Your Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register("name", {
                    required: "Name is required",
                  })}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register("phone")}
                  placeholder="+91 9876543210"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Company
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register("company")}
                  placeholder="Your company"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Project Details
              </label>

              <div className="relative">
                <MessageSquare
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  {...register("message", {
                    required:
                      "Please tell us about your project",
                  })}
                  rows={5}
                  placeholder="Tell us what you need..."
                  className={`${inputClass} pl-11`}
                />
              </div>

              {errors.message && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default PublicContact;


