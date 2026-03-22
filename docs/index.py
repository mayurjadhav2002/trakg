import os

# List of paths (relative to project root)
paths = [
    # How-To Guides
    "how-to/verification",
    "how-to/websites/new-website",
    "how-to/websites/delete-website",
    "how-to/websites/update-website",
    "how-to/websites/verify-website",
    "how-to/forms/add-form",
    "how-to/forms/pause-tracking",
    "how-to/inputs/disable-tracking",
    "how-to/inputs/add-identifier",
    "how-to/customization/form-name",
    "how-to/customization/input-names",
    "how-to/analytics/lead-analytics",
    "how-to/analytics/form-analytics",
    "how-to/analytics/engagement",
    "how-to/analytics/acquisition",

    # Frameworks
    "frameworks/overview",
    "frameworks/integration-guides",
    "frameworks/react",
    "frameworks/nextjs",
    "frameworks/vue",
    "frameworks/laravel",
    "frameworks/html-css",

    # Third-Party
    "third-party/wordpress",
    "third-party/webflow",
    "third-party/shopify",
    "third-party/wix",
    "third-party/no-code",

    # Core Features
    "features/partial-form-filling",
    "features/auto-form-filling",
    "features/security-compliance",
    "features/advanced-analytics",
    "features/automations"
]


for path in paths:
    full_dir = os.path.dirname(path)
    file_path = f"{path}.mdx"

    # Create the directory if it doesn't exist
    os.makedirs(full_dir, exist_ok=True)

    # Create a placeholder file if it doesn't exist
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write(f"# {os.path.basename(path).replace('-', ' ').title()}\n\nContent coming soon...\n")
        print(f"Created: {file_path}")
    else:
        print(f"Exists: {file_path}")
