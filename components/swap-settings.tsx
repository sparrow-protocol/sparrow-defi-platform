"use client"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useSwapSettings } from "@/app/hooks/use-swap-settings"

// This component is now designed to be rendered directly within a tab, not as a dialog trigger.
// The Dialog components are kept for reference if it needs to be a modal again, but are not used in its current tab-based implementation.
export function SwapSettings() {
  const { settings, updateSettings } = useSwapSettings()

  return (
    <div className="grid gap-6 py-4">
      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="slippage" className="md:text-right text-black dark:text-white">
          Slippage Tolerance
        </Label>
        <div className="md:col-span-3 flex flex-col sm:flex-row items-center gap-2">
          <Slider
            id="slippage"
            min={0.1}
            max={5}
            step={0.1}
            value={[settings.slippage]}
            onValueChange={(val) => updateSettings({ slippage: val[0] })}
            className="w-full sm:w-[calc(100%-100px)]"
          />
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={settings.slippage}
              onChange={(e) => updateSettings({ slippage: Number.parseFloat(e.target.value) || 0 })}
              className="w-20 text-center border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
            <span className="text-black dark:text-white">%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="speed" className="md:text-right text-black dark:text-white">
          Transaction Speed
        </Label>
        <RadioGroup
          id="speed"
          value={settings.transactionSpeed}
          onValueChange={(val: "auto" | "fast" | "turbo") => updateSettings({ transactionSpeed: val })}
          className="md:col-span-3 flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auto" id="auto" className="text-gold border-light-gray dark:border-dark-gray" />
            <Label htmlFor="auto" className="text-black dark:text-white">
              Auto
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fast" id="fast" className="text-gold border-light-gray dark:border-dark-gray" />
            <Label htmlFor="fast" className="text-black dark:text-white">
              Fast
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="turbo" id="turbo" className="text-gold border-light-gray dark:border-dark-gray" />
            <Label htmlFor="turbo" className="text-black dark:text-white">
              Turbo
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="mev" className="md:text-right text-black dark:text-white">
          MEV Protection
        </Label>
        <div className="md:col-span-3">
          <Switch
            id="mev"
            checked={settings.mevProtection}
            onCheckedChange={(checked) => updateSettings({ mevProtection: checked })}
            className="data-[state=checked]:bg-gold data-[state=unchecked]:bg-medium-gray dark:data-[state=unchecked]:bg-dark-gray"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="customFee" className="md:text-right text-black dark:text-white">
          Custom Fee
        </Label>
        <div className="md:col-span-3 flex items-center space-x-2">
          <Input
            type="number"
            value={settings.customFee}
            onChange={(e) => updateSettings({ customFee: Number.parseFloat(e.target.value) || 0 })}
            className="w-24 text-center border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
          />
          <span className="text-black dark:text-white">%</span>
        </div>
      </div>

      {/* New: Platform Fee (bps) */}
      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="platformFee" className="md:text-right text-black dark:text-white">
          Platform Fee (bps)
        </Label>
        <div className="md:col-span-3 flex items-center space-x-2">
          <Input
            id="platformFee"
            type="number"
            value={settings.platformFeeBps}
            onChange={(e) => updateSettings({ platformFeeBps: Number.parseInt(e.target.value) || 0 })}
            className="w-24 text-center border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            min={0}
            max={100} // Jupiter allows up to 100 bps (1%)
          />
          <span className="text-black dark:text-white">bps (0.01%)</span>
        </div>
      </div>

      {/* Placeholder for more settings */}
      <div className="grid md:grid-cols-4 items-center gap-4">
        <Label htmlFor="darkModeSync" className="md:text-right text-black dark:text-white">
          Sync Theme
        </Label>
        <div className="md:col-span-3">
          <Switch
            id="darkModeSync"
            checked={true} // Always true for now, placeholder
            onCheckedChange={() => {
              /* Placeholder for future logic */
            }}
            className="data-[state=checked]:bg-gold data-[state=unchecked]:bg-medium-gray dark:data-[state=unchecked]:bg-dark-gray"
          />
        </div>
      </div>
    </div>
  )
}
