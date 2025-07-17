import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const dummyChartData = [
  { name: "Jan", price: 30000 },
  { name: "Feb", price: 32000 },
  { name: "Mar", price: 31000 },
  { name: "Apr", price: 33000 },
  { name: "May", price: 35000 },
  { name: "Jun", price: 34000 },
]

export default function PerpsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold">Perpetual Futures Trading</CardTitle>
          <p className="text-muted-foreground">Trade perpetual contracts with leverage.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>BTC/USDC Perpetual</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Open Orders</h3>
              <div className="text-muted-foreground">No open orders.</div>
              <Separator className="my-4" />
              <h3 className="text-xl font-semibold mb-4">Trade History</h3>
              <div className="text-muted-foreground">No trade history.</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Tabs defaultValue="long">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="long">Long</TabsTrigger>
                <TabsTrigger value="short">Short</TabsTrigger>
              </TabsList>
              <TabsContent value="long" className="mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="long-amount">Amount (USDC)</Label>
                    <Input id="long-amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="long-leverage">Leverage</Label>
                    <Select defaultValue="2x">
                      <SelectTrigger id="long-leverage">
                        <SelectValue placeholder="Select leverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x">1x</SelectItem>
                        <SelectItem value="2x">2x</SelectItem>
                        <SelectItem value="5x">5x</SelectItem>
                        <SelectItem value="10x">10x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-positive-green hover:bg-green-700 text-white">Open Long</Button>
                </div>
              </TabsContent>
              <TabsContent value="short" className="mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="short-amount">Amount (USDC)</Label>
                    <Input id="short-amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="short-leverage">Leverage</Label>
                    <Select defaultValue="2x">
                      <SelectTrigger id="short-leverage">
                        <SelectValue placeholder="Select leverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x">1x</SelectItem>
                        <SelectItem value="2x">2x</SelectItem>
                        <SelectItem value="5x">5x</SelectItem>
                        <SelectItem value="10x">10x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-negative-red hover:bg-red-700 text-white">Open Short</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
