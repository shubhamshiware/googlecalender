import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import { ThemeProvider } from './context/ThemeContext';
import { ReminderProvider, useReminder } from './context/ReminderContext';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { NotificationToast } from './components/NotificationToast';
import { MobileHeader } from './components/Mobile/MobileHeader';
import { MobileSidebar } from './components/Mobile/MobileSidebar';
import { BottomNavigationBar } from './components/Mobile/BottomNavigationBar';
import { FloatingActionButton } from './components/Mobile/FloatingActionButton';
import { MobileCalendarView } from './components/Mobile/MobileCalendarView';
import { MobileDayView } from './components/Mobile/MobileDayView';
import { MobileSearchView } from './components/Mobile/MobileSearchView';
import { useMobileDetect } from './hooks/useMobileDetect';
import { useState, useEffect } from 'react';

const ReminderInitializer = () => {
  const { token } = useAuth();
  const { requestNotificationPermission } = useReminder();

  useEffect(() => {
    if (token) {
      requestNotificationPermission().catch((error) => {
        console.warn('Failed to request notification permission:', error);
      });
    }
  }, [token, requestNotificationPermission]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token, initialized } = useAuth();
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user || !token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const DesktopCalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const { messages, removeMessage } = useReminder();

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      <NotificationToast messages={messages} onRemove={removeMessage} />
    </div>
  );
};

const MobileCalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const { messages, removeMessage } = useReminder();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900">
      <MobileHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Calendar"
      />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {children}
      <NotificationToast messages={messages} onRemove={removeMessage} />
    </div>
  );
};

const WeekViewPage = () => {
  const { isSmallScreen } = useMobileDetect();
  const [weekStart, setWeekStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mobileActiveTab, setMobileActiveTab] = useState('week');

  const handlePrevWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  const mobileNavigationItems = [
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      onClick: () => {
        setWeekStart(new Date());
        setSelectedDate(new Date());
        setMobileActiveTab('today');
      },
    },
    {
      id: 'week',
      label: 'Week',
      icon: '📆',
      onClick: () => setMobileActiveTab('week'),
    },
    {
      id: 'month',
      label: 'Month',
      icon: '📊',
      onClick: () => setMobileActiveTab('month'),
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      onClick: () => setMobileActiveTab('search'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => setMobileActiveTab('settings'),
    },
  ];

  if (isSmallScreen) {
    return (
      <MobileCalendarLayout>
        {mobileActiveTab === 'today' && (
          <MobileDayView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        {mobileActiveTab === 'week' && (
          <MobileCalendarView
            viewType="week"
            startDate={weekStart}
            onPrevious={handlePrevWeek}
            onNext={handleNextWeek}
          />
        )}
        {mobileActiveTab === 'month' && (
          <MobileCalendarView
            viewType="month"
            startDate={weekStart}
            onPrevious={handlePrevWeek}
            onNext={handleNextWeek}
          />
        )}
        {mobileActiveTab === 'search' && <MobileSearchView />}
        {mobileActiveTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900 pt-14 pb-16">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Settings coming soon</p>
            </div>
          </div>
        )}
        <FloatingActionButton onClick={() => {}} />
        <BottomNavigationBar
          items={mobileNavigationItems}
          activeTab={mobileActiveTab}
        />
      </MobileCalendarLayout>
    );
  }

  return (
    <DesktopCalendarLayout>
      <Sidebar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      <WeekView
        startDate={weekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
    </DesktopCalendarLayout>
  );
};

const MonthViewPage = () => {
  const { isSmallScreen } = useMobileDetect();
  const [monthStart, setMonthStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mobileActiveTab, setMobileActiveTab] = useState('month');

  const handlePrevMonth = () => {
    const newDate = new Date(monthStart);
    newDate.setMonth(newDate.getMonth() - 1);
    setMonthStart(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(monthStart);
    newDate.setMonth(newDate.getMonth() + 1);
    setMonthStart(newDate);
  };

  const mobileNavigationItems = [
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      onClick: () => {
        setMonthStart(new Date());
        setSelectedDate(new Date());
        setMobileActiveTab('today');
      },
    },
    {
      id: 'week',
      label: 'Week',
      icon: '📆',
      onClick: () => setMobileActiveTab('week'),
    },
    {
      id: 'month',
      label: 'Month',
      icon: '📊',
      onClick: () => setMobileActiveTab('month'),
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      onClick: () => setMobileActiveTab('search'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => setMobileActiveTab('settings'),
    },
  ];

  if (isSmallScreen) {
    return (
      <MobileCalendarLayout>
        {mobileActiveTab === 'today' && (
          <MobileDayView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        {mobileActiveTab === 'week' && (
          <MobileCalendarView
            viewType="week"
            startDate={monthStart}
            onPrevious={handlePrevMonth}
            onNext={handleNextMonth}
          />
        )}
        {mobileActiveTab === 'month' && (
          <MobileCalendarView
            viewType="month"
            startDate={monthStart}
            onPrevious={handlePrevMonth}
            onNext={handleNextMonth}
          />
        )}
        {mobileActiveTab === 'search' && <MobileSearchView />}
        {mobileActiveTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900 pt-14 pb-16">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Settings coming soon</p>
            </div>
          </div>
        )}
        <FloatingActionButton onClick={() => {}} />
        <BottomNavigationBar
          items={mobileNavigationItems}
          activeTab={mobileActiveTab}
        />
      </MobileCalendarLayout>
    );
  }

  return (
    <DesktopCalendarLayout>
      <Sidebar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      <MonthView
        startDate={monthStart}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
    </DesktopCalendarLayout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CalendarProvider>
              <ReminderProvider>
                <ReminderInitializer />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/week"
                    element={
                      <ProtectedRoute>
                        <WeekViewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/month"
                    element={
                      <ProtectedRoute>
                        <MonthViewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/week" />} />
                </Routes>
              </ReminderProvider>
            </CalendarProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;
