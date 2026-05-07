import { Square } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { DropdownButton } from "./button-dropdown";

function SectionTitle({ title, token }: { title: string; token: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-5xl font-semibold leading-none text-[#1c1c1c]">{title}</h2>
      <p className="mt-2 text-lg font-medium text-[#8a57db]">❖ {token}</p>
    </div>
  );
}

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-[#b7a6d9] bg-white p-6">{children}</div>;
}

const icon = <Square className="h-2.5 w-2.5 fill-current" />;

export function ButtonShowcase() {
  return (
    <section className="space-y-10 pb-12">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div>
          <SectionTitle title="Buttons" token="Button/btn-basic" />
          <Box>
            <div className="space-y-7">
              <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-x-7 gap-y-6">
                <Button size="sm">Button</Button>
                <Button size="sm" icon={icon}>
                  Button
                </Button>
                <Button size="sm" icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button size="sm" icon={icon} iconOnly aria-label="Small icon button" />

                <Button>Button</Button>
                <Button icon={icon}>Button</Button>
                <Button icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button icon={icon} iconOnly aria-label="Medium icon button" />

                <Button size="lg">Button</Button>
                <Button size="lg" icon={icon}>
                  Button
                </Button>
                <Button size="lg" icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button size="lg" icon={icon} iconOnly aria-label="Large icon button" />
              </div>

              <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-x-7 gap-y-6">
                <Button variant="outline" size="sm">
                  Button
                </Button>
                <Button variant="outline" size="sm" icon={icon}>
                  Button
                </Button>
                <Button variant="outline" size="sm" icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button variant="outline" size="sm" icon={icon} iconOnly aria-label="Small outlined icon button" />

                <Button variant="outline">Button</Button>
                <Button variant="outline" icon={icon}>
                  Button
                </Button>
                <Button variant="outline" icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button variant="outline" icon={icon} iconOnly aria-label="Medium outlined icon button" />

                <Button variant="outline" size="lg">
                  Button
                </Button>
                <Button variant="outline" size="lg" icon={icon}>
                  Button
                </Button>
                <Button variant="outline" size="lg" icon={icon} iconPosition="right">
                  Button
                </Button>
                <Button variant="outline" size="lg" icon={icon} iconOnly aria-label="Large outlined icon button" />
              </div>
            </div>
          </Box>
        </div>

        <div>
          <SectionTitle title="Button group" token="Button/btn-group" />
          <Box>
            <div className="space-y-7">
              <div className="grid grid-cols-[1fr_auto] gap-7">
                <div className="space-y-6">
                  <ButtonGroup>
                    <Button size="sm">Button</Button>
                    <Button size="sm">Button</Button>
                    <Button size="sm">Button</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button>Button</Button>
                    <Button>Button</Button>
                    <Button>Button</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button size="lg">Button</Button>
                    <Button size="lg">Button</Button>
                    <Button size="lg">Button</Button>
                  </ButtonGroup>
                </div>
                <div className="space-y-6">
                  <ButtonGroup>
                    <Button size="sm" icon={icon} iconOnly aria-label="Small grouped icon button" />
                    <Button size="sm" icon={icon} iconOnly aria-label="Small grouped icon button" />
                    <Button size="sm" icon={icon} iconOnly aria-label="Small grouped icon button" />
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button icon={icon} iconOnly aria-label="Medium grouped icon button" />
                    <Button icon={icon} iconOnly aria-label="Medium grouped icon button" />
                    <Button icon={icon} iconOnly aria-label="Medium grouped icon button" />
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button size="lg" icon={icon} iconOnly aria-label="Large grouped icon button" />
                    <Button size="lg" icon={icon} iconOnly aria-label="Large grouped icon button" />
                    <Button size="lg" icon={icon} iconOnly aria-label="Large grouped icon button" />
                  </ButtonGroup>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-7">
                <div className="space-y-6">
                  <ButtonGroup>
                    <Button variant="outline" size="sm">
                      Button
                    </Button>
                    <Button variant="outline" size="sm">
                      Button
                    </Button>
                    <Button variant="outline" size="sm">
                      Button
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline">Button</Button>
                    <Button variant="outline">Button</Button>
                    <Button variant="outline">Button</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline" size="lg">
                      Button
                    </Button>
                    <Button variant="outline" size="lg">
                      Button
                    </Button>
                    <Button variant="outline" size="lg">
                      Button
                    </Button>
                  </ButtonGroup>
                </div>
                <div className="space-y-6">
                  <ButtonGroup>
                    <Button variant="outline" size="sm" icon={icon} iconOnly aria-label="Small outlined grouped icon button" />
                    <Button variant="outline" size="sm" icon={icon} iconOnly aria-label="Small outlined grouped icon button" />
                    <Button variant="outline" size="sm" icon={icon} iconOnly aria-label="Small outlined grouped icon button" />
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline" icon={icon} iconOnly aria-label="Medium outlined grouped icon button" />
                    <Button variant="outline" icon={icon} iconOnly aria-label="Medium outlined grouped icon button" />
                    <Button variant="outline" icon={icon} iconOnly aria-label="Medium outlined grouped icon button" />
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline" size="lg" icon={icon} iconOnly aria-label="Large outlined grouped icon button" />
                    <Button variant="outline" size="lg" icon={icon} iconOnly aria-label="Large outlined grouped icon button" />
                    <Button variant="outline" size="lg" icon={icon} iconOnly aria-label="Large outlined grouped icon button" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>

      <div className="max-w-[320px]">
        <SectionTitle title="Button dropdown" token="Button/btn-menu" />
        <Box>
          <div className="space-y-4">
            <DropdownButton>Button</DropdownButton>
            <DropdownButton variant="outline">Button</DropdownButton>
          </div>
        </Box>
      </div>
    </section>
  );
}
