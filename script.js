const form = document.querySelector('#orderForm');
const usernameInput = document.querySelector('#username');
const usernameError = document.querySelector('#usernameError');
const payment = document.querySelector('#payment');
const transferContent = document.querySelector('#transferContent');
const confirmBtn = document.querySelector('#confirmBtn');
const copyContent = document.querySelector('#copyContent');
const toast = document.querySelector('#toast');

let currentUsername = '';
let toastTimer;

function normalizeUsername(value) {
  return value.trim().replace(/^@+/, '').replace(/\s+/g, '');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(value, successMessage = 'Đã sao chép') {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const area = document.createElement('textarea');
    area.value = value;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast(successMessage);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  currentUsername = normalizeUsername(usernameInput.value);

  if (currentUsername.length < 2 || !/^[a-zA-Z0-9._-]+$/.test(currentUsername)) {
    usernameError.textContent = 'Hãy nhập đúng username, không dùng khoảng trắng hoặc ký tự đặc biệt.';
    usernameInput.focus();
    return;
  }

  usernameError.textContent = '';
  usernameInput.value = currentUsername;
  transferContent.textContent = `LOCKET ${currentUsername}`;
  payment.hidden = false;
  payment.classList.remove('reveal');
  requestAnimationFrame(() => payment.classList.add('reveal'));
  payment.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => copyText(button.dataset.copy));
});

copyContent.addEventListener('click', () => copyText(transferContent.textContent));

confirmBtn.addEventListener('click', async () => {
  const orderText = [
    'ĐƠN ĐĂNG KÝ LOCKET GOLD',
    `Username: @${currentUsername}`,
    'Gói: Vĩnh viễn',
    'Số tiền: 30.000đ',
    'Mình đã chuyển khoản, nhờ bạn kiểm tra giúp.'
  ].join('\n');

  await copyText(orderText, 'Đã sao chép nội dung đơn');
  setTimeout(() => {
    window.location.href = 'https://zalo.me/0372083318';
  }, 550);
});
