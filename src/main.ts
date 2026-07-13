import "./style.css";

type IpResponse = {
  ip?: unknown;
};

const API_URL = "https://api64.ipify.org?format=json";
const REQUEST_TIMEOUT_MS = 8_000;

const page = getElement<HTMLElement>(".network-info");
const ipAddress = getElement<HTMLElement>("#ip-address");
const retry = getElement<HTMLButtonElement>("#retry");

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function asText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function setLoadingState() {
  page.dataset.state = "loading";
  ipAddress.textContent = "Loading…";
  retry.hidden = true;
}

function setReadyState(data: IpResponse) {
  const ip = asText(data.ip);

  if (!ip) {
    throw new Error("The IP service returned an invalid response.");
  }

  ipAddress.textContent = ip;
  page.dataset.state = "ready";
  retry.hidden = true;
}

function setErrorState() {
  page.dataset.state = "error";
  ipAddress.textContent = navigator.onLine
    ? "Unable to find your IP"
    : "You appear to be offline";
  retry.hidden = false;
}

async function loadNetworkInfo() {
  setLoadingState();

  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`IP lookup failed with status ${response.status}.`);
    }

    const data = (await response.json()) as IpResponse;
    setReadyState(data);
  } catch (error) {
    console.error("Could not load network information.", error);
    setErrorState();
  }
}

retry.addEventListener("click", loadNetworkInfo);
window.addEventListener("online", () => {
  if (page.dataset.state === "error") {
    void loadNetworkInfo();
  }
});

void loadNetworkInfo();
