"use client"
import { EmptyState } from "@/components/ui/empty-state"
import { 
  FileText, 
  Link, 
  Files, 
  Search, 
  MessageSquare, 
  Mail, 
  Image,
  FileQuestion,
  Settings
} from "lucide-react"

export function EmptyStateDefault({title, description, button}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icons={[FileText, Link, Files]}
      action={{
        label: button,
        onClick: () => window.location.href = '/dashboard/website/new?ref=es-default-btn'
      }}
    />
  )
}

export function EmptyStateMessages() {
  return (
    <EmptyState
      title="No Messages"
      description="Start a conversation by sending a message."
      icons={[MessageSquare, Mail]}
      action={{
        label: "Send Message",
        onClick: () => console.log("Send message clicked")
      }}
    />
  )
}

function EmptyStateSearch() {
  return (
    <EmptyState
      title="No Results Found"
      description="Try adjusting your search filters."
      icons={[Search, FileQuestion]}
    />
  )
}

function EmptyStateMedia() {
  return (
    <EmptyState
      title="No Images"
      description="Upload images to get started with your gallery."
      icons={[Image]}
      action={{
        label: "Upload Images",
        onClick: () => console.log("Upload clicked")
      }}
    />
  )
}

function EmptyStateSettings() {
  return (
    <EmptyState
      title="No Settings"
      description="Configure your application settings to get started."
      icons={[Settings]}
      action={{
        label: "Configure",
        onClick: () => console.log("Configure clicked")
      }}
    />
  )
}


