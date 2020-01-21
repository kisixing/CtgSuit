
#include <iostream>
#include <fstream>
#include <Windows.h>
using std::cout;
using std::endl;
using std::fstream;
using std::string;

void CALLBACK f(HWND hwnd, UINT uMsg, UINT timerId, DWORD dwTime)
{
	cout << "zz" << endl;
}

void ST()
{
	MSG msg;

	SetTimer(NULL, 0, 1000, (TIMERPROC)&f);
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}
}

int main(int argc, char **argv)
{

	// LPSTARTUPINFO lpStartupInfo;
	// LPPROCESS_INFORMATION lpProcessInfo;

	Sleep(5000);
	if (argc < 4)
	{
		ST();
		return 0;
	}
	char *o_name = argv[1];
	char *n_name = argv[2];
	char *exec_name = argv[3];

	std::fstream fs_o;
	fs_o.open(o_name);

	if (fs_o)
	{
		fs_o.close();
		int r = remove(o_name);
		cout << "remove1" << r << endl;
	}

	std::fstream fs_n;
	fs_n.open(n_name);

	if (fs_n)
	{
		fs_n.close();
		int r = rename(n_name, o_name);
		cout << "rename1" << r << endl;
	}

	std::fstream fs_e;
	fs_e.open(exec_name);

	if (fs_e)
	{
		fs_e.close();
		STARTUPINFO lpStartupInfo;
		PROCESS_INFORMATION lpProcessInfo;

		ZeroMemory(&lpStartupInfo, sizeof(lpStartupInfo));
		lpStartupInfo.cb = sizeof(lpStartupInfo);
		ZeroMemory(&lpProcessInfo, sizeof(lpProcessInfo));

		CreateProcess(exec_name,
					  NULL, NULL, NULL,
					  NULL, NULL, NULL, NULL,
					  &lpStartupInfo,
					  &lpProcessInfo);

		cout << "exec" << endl;
		exit(0);
	}
	return 0;
}
