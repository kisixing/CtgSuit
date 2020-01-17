
#include <iostream>
#include <fstream>
#include <Windows.h>
using std::string;
using std::fstream;
using std::cout;
using std::endl;



void CALLBACK f(HWND hwnd, UINT uMsg, UINT timerId, DWORD dwTime)
{
  cout<<"zz"<<endl;
}

void ST()
{
  MSG msg;

  SetTimer(NULL, 0, 1000,(TIMERPROC) &f);
  while(GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
}



int main(int argc, char ** argv)
{
	if (argc < 3) {
		ST();
		return 0;
	}
	char *o_name = argv[1];
	char *n_name = argv[2];
	
	std::fstream fs_o;
	fs_o.open(o_name);
	
	if (fs_o) {
		fs_o.close();
		int r = remove(o_name);
		cout << "remove" << r << endl;
	}

	std::fstream fs_n;
	fs_n.open(n_name);

	if (fs_n) {
		fs_n.close();
		int r = rename(n_name, o_name);
		cout << "rename" << r << endl;
	}
	return 0;
}
