'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBrowserClient } from '@supabase/ssr'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Webhook } from './types'

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    description: '',
    secret: crypto.randomUUID()
  })
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadWebhooks()
  }, [])

  // Load webhooks
  const loadWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWebhooks(data || [])
    } catch (error) {
      console.error('Error loading webhooks:', error)
      toast({
        title: 'Error',
        description: 'Failed to load webhooks',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create webhook
  const createWebhook = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          url: newWebhook.url,
          description: newWebhook.description,
          secret: newWebhook.secret
        })
        .select()
        .single()

      if (error) throw error

      setWebhooks([data, ...webhooks])
      setNewWebhook({
        url: '',
        description: '',
        secret: crypto.randomUUID()
      })

      toast({
        title: 'Success',
        description: 'Webhook created successfully'
      })
    } catch (error) {
      console.error('Error creating webhook:', error)
      toast({
        title: 'Error',
        description: 'Failed to create webhook',
        variant: 'destructive'
      })
    }
  }

  // Toggle webhook status
  const toggleWebhook = async (webhook: Webhook) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !webhook.is_active })
        .eq('id', webhook.id)

      if (error) throw error

      setWebhooks(webhooks.map(w =>
        w.id === webhook.id
          ? { ...w, is_active: !w.is_active }
          : w
      ))

      toast({
        title: 'Success',
        description: `Webhook ${webhook.is_active ? 'disabled' : 'enabled'} successfully`
      })
    } catch (error) {
      console.error('Error toggling webhook:', error)
      toast({
        title: 'Error',
        description: 'Failed to toggle webhook status',
        variant: 'destructive'
      })
    }
  }

  // Delete webhook
  const deleteWebhook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setWebhooks(webhooks.filter(w => w.id !== id))
      toast({
        title: 'Success',
        description: 'Webhook deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting webhook:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete webhook',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Manage webhooks for dataset change notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Webhook</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Webhook</DialogTitle>
                  <DialogDescription>
                    Add a new webhook endpoint to receive dataset change notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newWebhook.url}
                      onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })}
                      placeholder="https://your-endpoint.com/webhook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newWebhook.description}
                      onChange={e => setNewWebhook({ ...newWebhook, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secret">Secret</Label>
                    <Input
                      id="secret"
                      value={newWebhook.secret}
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createWebhook}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoading ? (
              <div>Loading webhooks...</div>
            ) : webhooks.length === 0 ? (
              <div>No webhooks configured</div>
            ) : (
              <div className="space-y-4">
                {webhooks.map(webhook => (
                  <Card key={webhook.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{webhook.url}</h4>
                            <Badge variant={webhook.is_active ? "default" : "secondary"}>
                              {webhook.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {webhook.failure_count > 0 && (
                              <Badge variant="destructive">
                                {webhook.failure_count} failures
                              </Badge>
                            )}
                          </div>
                          {webhook.description && (
                            <p className="text-sm text-muted-foreground">{webhook.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Last triggered: {webhook.last_triggered_at ? new Date(webhook.last_triggered_at).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={webhook.is_active}
                            onCheckedChange={() => toggleWebhook(webhook)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteWebhook(webhook.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}